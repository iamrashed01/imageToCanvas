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
        const canvas = await ConvertFileIntoCanvas(file);
        imagesList.push(canvas.toDataURL());
      }
    }

    console.log(imagesList, "imagesList");
    downloadImageAsZip(imagesList);
  };

  async function downloadImageAsZip(imagesList) {
    var zip = new JSZip();
    var timestamp = new Date().getUTCMilliseconds();

    const imagesFolder = zip.folder("images_folder");
    let index = 0;
    for await (const img of imagesList) {
      await imagesFolder.file(
        timestamp + index + ".jpg",
        img.replace("data:image/png;base64,", ""),
        {
          base64: true,
        }
      );
      index += 1;
    }

    // zip.file(timestamp, imagesList[0].replace("data:image/png;base64,", ""), {
    //   base64: true,
    // });

    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, "ZipFileName.zip");
      console.log(content, "content");
    });

    // download file
    var saveData = (function () {
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      return function (data, fileName) {
        var json = JSON.stringify(data),
          blob = new Blob([json], { type: "octet/stream" }),
          url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      };
    })();
  }

  const ConvertFileIntoCanvas = (file) => {
    var _URL = window.URL || window.webkitURL;
    var img;

    return new Promise((resolve, reject) => {
      img = new Image();
      var objectUrl = _URL.createObjectURL(file);
      console.count("lpop");
      img.onload = function () {
        console.count("onload");
        // console.log(this.width + " " + this.height);

        const cnv = createPlaceholderCanvas(this.height, this.width);
        console.log(cnv, "convas");

        return resolve(cnv);
        _URL.revokeObjectURL(objectUrl);
      };
      img.src = objectUrl;
    });
  };

  const createPlaceholderCanvas = (height, width) => {
    var canvas = document.createElement("canvas");

    // canvas.id = "CursorLayer";
    canvas.width = width;
    canvas.height = height;
    // canvas.style.position = "absolute";
    // canvas.style.border = "1px solid";

    // below is optional

    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgb(255 , 255, 255)";
    ctx.strokeStyle = "";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    // ctx.fillRect(150, 150, 200, 200);
    // ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
    // ctx.fillRect(200, 50, 200, 200);

    // below is adding text to canvas
    // ctx.strokeText("300*200", 100, 150);
    // ctx.strokeStyle = "#999";
    // // ctx.lineWidth = 50;
    // ctx.font = "70px Verdana";

    ctx.font = "20px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.direction = "inherit";
    ctx.fillText(`${height} * ${width}`, width / 2, height / 2);

    // draw image
    // ctx.drawImage(img, 10, 10);

    // print to html body
    document.body.appendChild(canvas);

    // returning the canvas image
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
            <input multiple id="upload" onChange={getImages} type="file" />
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
