import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  const getImages = ({ target: { files } }) => {
    var _URL = window.URL || window.webkitURL;
    var img;
    if (files.length > 0) {
      for (const file of files) {
        img = new Image();
        var objectUrl = _URL.createObjectURL(file);
        img.onload = function () {
          console.log(this.width + " " + this.height);
          _URL.revokeObjectURL(objectUrl);
        };
        img.src = objectUrl;
      }
    }
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
