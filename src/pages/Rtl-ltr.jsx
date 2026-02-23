import TopHeader from "../TopHeader";
import { useLanguage } from "../../context/LanguageContext";

const languages = [
  { code: "en", label: "English", native: "English", dir: "ltr" },
  { code: "hi", label: "Hindi", native: "हिन्दी", dir: "ltr" },
  { code: "ur", label: "Urdu", native: "اردو", dir: "rtl" },
  { code: "ar", label: "Arabic", native: "العربية", dir: "rtl" },
  { code: "fr", label: "French", native: "Français", dir: "ltr" },
  { code: "de", label: "German", native: "Deutsch", dir: "ltr" },
  { code: "es", label: "Spanish", native: "Español", dir: "ltr" },
  { code: "it", label: "Italian", native: "Italiano", dir: "ltr" },
  { code: "pt", label: "Portuguese", native: "Português", dir: "ltr" },
  { code: "zh", label: "Chinese", native: "中文", dir: "ltr" },
];

export default function Languages() {
  const { language, setLanguage } = useLanguage();

  return (
    <>
      <TopHeader />

      <div className="settings-page">
        <h2 className="settings-title">🌐 Language Settings</h2>
        <p className="settings-sub">
          Select your preferred language for the dashboard
        </p>

        <div className="language-card">
          {languages.map((lang) => (
            <label
              key={lang.code}
              className={`language-row ${
                language === lang.code ? "active" : ""
              }`}
            >
              <div className="lang-left">
                <input
                  type="radio"
                  name="language"
                  checked={language === lang.code}
                  onChange={() => setLanguage(lang.code)}
                />
                <div>
                  <b>{lang.label}</b>
                  <div className="native">{lang.native}</div>
                </div>
              </div>

              <span
                className={`dir-badge ${
                  lang.dir === "rtl" ? "rtl" : "ltr"
                }`}
              >
                {lang.dir.toUpperCase()}
              </span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
}