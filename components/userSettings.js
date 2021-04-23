import styles from "../styles/Settings.module.css";
import { GearIcon } from "./svgIcons";

export default function UserSettings({ values, onChange, toggleFilterAble }) {
  return (
    <div
      className={`${styles.settingsCard} ${
        values.filterAble ? "" : styles.disableSettings
      }`}
    >
      <div className={styles.formControl}>
        <label>Zip Filename</label>
        <input
          value={values.zip_filename}
          name="zip_filename"
          onChange={onChange}
          type="text"
          placeholder=""
        />
      </div>
      <div className={styles.formControl}>
        <label>Background Color</label>
        <input
          className={styles.colorInput}
          style={{ opacity: values.bg_color === "" ? 0.3 : 1 }}
          value={values.bg_color}
          name="bg_color"
          onChange={onChange}
          type="color"
          placeholder=""
        />
      </div>
      <div className={styles.formControl}>
        <label>Label Color</label>
        <input
          className={styles.colorInput}
          style={{ opacity: values.label_color === "" ? 0.3 : 1 }}
          value={values.label_color}
          name="label_color"
          onChange={onChange}
          type="color"
          placeholder=""
        />
      </div>
      <GearIcon
        onClick={toggleFilterAble}
        className={`${styles.settingsToggeNtn} ${
          values.filterAble ? styles.rotaing : ""
        }`}
      />
    </div>
  );
}
