import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import UserSettings from "../components/userSettings";

export default function Home() {
  // settings
  const [state, setState] = useState({
    zip_filename: "",
    bg_color: "",
    label_color: "",
    filterAble: false,
  });

  const toggleFilterAble = () => {
    setState({
      zip_filename: "",
      bg_color: "",
      label_color: "",
      filterAble: !state.filterAble,
    });
  };

  const changeHandler = ({ target: { name, value } }) => {
    setState({ ...state, [name]: value });
  };

  // reciving the images from onchange handdler
  const getImagesHandler = async ({ target: { files } }) => {
    var bs64Array = [];

    if (files.length > 0) {
      for await (const file of files) {
        try {
          const canvas = await convertFileIntoCanvas(
            file,
            state.bg_color,
            state.label_color
          );
          // convert canvas into bs64 and push into an array[]
          if (canvas) {
            bs64Array.push({ bs64: canvas.toDataURL(), fileName: file.name });
          }
        } catch (error) {
          console.error(error.message);
        }
      }
      // client download given images as zip
      if (bs64Array.length > 0) {
        downloadImageAsZip(bs64Array, state.zip_filename);
      }
    }
  };

  // download bs64->images as zip
  async function downloadImageAsZip(bs64Array, zip_filename) {
    let zip = new JSZip();
    const zipFileName = zip_filename || "image-to-canvas";

    // const imagesFolder = zip.folder("images_folder");
    for await (const obj of bs64Array) {
      await zip.file(
        obj.fileName,
        obj.bs64.replace("data:image/png;base64,", ""),
        {
          base64: true,
        }
      );
    }

    // generate zip blob file
    zip.generateAsync({ type: "blob" }).then(function (content) {
      // save as zip file
      saveAs(content, `${zipFileName.replace(/\.[^/.]+$/, "")}.zip`);
    });
  }

  const convertFileIntoCanvas = (file, bg_color, label_color) => {
    var _URL = window.URL || window.webkitURL;
    var img;

    return new Promise((resolve, reject) => {
      img = new Image();
      var objectUrl = _URL.createObjectURL(file);
      img.onload = function () {
        const canvas = createPlaceholderCanvas(
          this.height,
          this.width,
          bg_color,
          label_color
        );
        _URL.revokeObjectURL(objectUrl);

        // resolve while img on load success
        return resolve(canvas);
      };

      // reject while img on error occured
      img.onerror = function (error) {
        return reject(error);
      };
      img.src = objectUrl;
    });
  };

  const createPlaceholderCanvas = (height, width, bg_color, label_color) => {
    // variables
    const canvas_background_color = bg_color || "rgb(250 250 250)";
    const text_color = label_color || "rgb(133 119 119)";

    // create canvas element
    let canvas = document.createElement("canvas");

    // resize canvas
    canvas.width = width;
    canvas.height = height;

    // canvas getContext as 2d view
    let ctx = canvas.getContext("2d");
    // styling the canvas
    ctx.fillStyle = canvas_background_color;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = text_color;

    // below is adding and styling text/label to canvas
    ctx.font = `${16}px serif`;
    ctx.font = `${4}vw serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.direction = "inherit";
    // add fill text into canvas
    ctx.fillText(`${height} * ${width}`, width / 2, height / 2);

    // draw image
    // ctx.drawImage(img, 10, 10);

    // print the canvas into html body
    // document.body.appendChild(canvas);

    return canvas;
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://github.com/iamrashed01">ImageToCanvas</a>
        </h1>

        <p className={styles.description}>
          Get started by Uploading <code className={styles.code}>Images</code>
        </p>

        <div className={styles.screen}>
          <UserSettings
            values={state}
            toggleFilterAble={toggleFilterAble}
            onChange={changeHandler}
          />
          <div>
            <label htmlFor="upload" className={styles.uploadImage}>
              Upload
              <input
                multiple
                id="upload"
                onChange={getImagesHandler}
                accept="image/*"
                type="file"
              />
            </label>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/iamrashed01"
          target="_blank"
          rel="noopener noreferrer"
        >
          Copyright by<strong className={styles.brandTitle}>iamrashed01</strong>
        </a>
      </footer>
    </div>
  );
}
