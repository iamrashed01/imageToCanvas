import Head from "next/head";
import { useEffect } from "react";
import styles from "../styles/Home.module.css";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function Home() {
  const getImages = async ({ target: { files } }) => {
    var imagesList = [];

    if (files.length > 0) {
      for await (const file of files) {
        const canvas = await convertFileIntoCanvas(file);
        imagesList.push({ bs64: canvas.toDataURL(), fileName: file.name });
      }
      downloadImageAsZip(imagesList);
    }
  };

  async function downloadImageAsZip(imagesList) {
    let zip = new JSZip();
    const zipFileName = "image-to-canvas";

    // const imagesFolder = zip.folder("images_folder");
    for await (const img of imagesList) {
      await zip.file(
        img.fileName,
        img.bs64.replace("data:image/png;base64,", ""),
        {
          base64: true,
        }
      );
    }

    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, `${zipFileName.replace(/\.[^/.]+$/, "")}.zip`);
    });
  }

  const convertFileIntoCanvas = (file) => {
    var _URL = window.URL || window.webkitURL;
    var img;

    return new Promise((resolve, reject) => {
      img = new Image();
      var objectUrl = _URL.createObjectURL(file);
      img.onload = function () {
        const canvas = createPlaceholderCanvas(this.height, this.width);
        _URL.revokeObjectURL(objectUrl);

        return resolve(canvas);
      };
      img.src = objectUrl;
    });
  };

  const createPlaceholderCanvas = (height, width) => {
    var canvas = document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;

    const text_color = "rgb(250 250 250)";
    const canvas_background_color = "rgb(133 119 119)";

    // styling the canvas
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = text_color;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = canvas_background_color;

    // below is adding text to canvas
    ctx.font = `${16}px serif`;
    ctx.font = `${4}vw serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.direction = "inherit";
    ctx.fillText(`${height} * ${width}`, width / 2, height / 2);

    // draw image
    // ctx.drawImage(img, 10, 10);

    // print the canvas to html body
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
          Welcome to <a href="https://nextjs.org">ImageToCanvas</a>
        </h1>

        <p className={styles.description}>
          Get started by Uploading <code className={styles.code}>Image</code>
        </p>
        <div>
          <label htmlFor="upload" className={styles.uploadImage}>
            Upload
            <input
              multiple
              id="upload"
              onChange={getImages}
              accept="image/*"
              type="file"
            />
          </label>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by<strong className={styles.brandTitle}>ImageToCanvas</strong>
        </a>
      </footer>
    </div>
  );
}
