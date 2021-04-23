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

  const [bs64List, setBs64List] = useState(null);

  // reciving the images from onchange handdler
  const getImagesHandler = async ({ target: { files } }) => {
    var bs64Array = [];
    setBs64List([]);

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
        // save bs64 array into state
        setBs64List(bs64Array);
        // install download
        // downloadImageAsZip(bs64Array, state.zip_filename);
      }
    } else {
      setBs64List(null);
    }
  };

  const downloadConvertedImages = () => {
    downloadImageAsZip(bs64List, state.zip_filename);
    return setBs64List(null);
  };

  const resetData = () => {
    setBs64List(null);
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
        <title>Image To Canvas | Image Placholder Generator</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          property="og:title"
          content="Image To Canvas | Image Placeholder Maker"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://imagetocanvas.vercel.app/" />
        <meta property="og:image" content="/banner.jpg" />
        <meta
          property="og:description"
          content="ImageToCanvas - Free online Open Source placeholder image generator tool."
        />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to{" "}
          <a href="https://github.com/iamrashed01/imageToCanvas">
            ImageToCanvas
          </a>
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
            {bs64List && bs64List.length > 0 ? (
              <>
                <button
                  onClick={downloadConvertedImages}
                  className={styles.downloadButton}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-download"
                    viewBox="0 0 16 16"
                  >
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                  </svg>
                  Download
                </button>
                <button
                  onClick={resetData}
                  className={[styles.downloadButton, styles.eraserBtn].join(
                    " "
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-eraser-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828l6.879-6.879zm.66 11.34L3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293l.16-.16z" />
                  </svg>
                </button>
              </>
            ) : (
              <label htmlFor="upload" className={styles.uploadImage}>
                {bs64List === null && "Upload"}
                {bs64List && bs64List.length <= 0 && (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className={`bi bi-arrow-repeat ${styles.rotaing}`}
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
                      <path
                        fill-rule="evenodd"
                        d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
                      />
                    </svg>
                    Processing
                  </>
                )}
                <input
                  multiple
                  id="upload"
                  onChange={getImagesHandler}
                  accept="image/*"
                  type="file"
                />
              </label>
            )}
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
