import {
  FaHome,
  FaUserTie,
  FaBed,
  FaUsers,
  FaBox,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaQrcode,
  FaClipboardList,
  FaChevronDown,
  FaBroom,
  FaDoorOpen,
  FaShieldAlt
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import Tooltip from "../components/common/Tooltip";
import { TOOLTIP_TEXT } from "../data/toolTip";
import { useLanguage } from "../context/LanguageContext";
import ComplianceDashboard from "../compliance/pages/ComplianceDashboard";

export default function Sidebar() {
  const { language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [openDashboard, setOpenDashboard] = useState(false);
  const [openRooms, setOpenRooms] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
const [openControl, setOpenControl] = useState(false);
  const [openCompliance, setOpenCompliance] = useState(false);
  
  useEffect(() => {
    if (location.pathname.startsWith("/dashboard")) setOpenDashboard(true);
    if (location.pathname.startsWith("/rooms")) setOpenRooms(true);
    if (location.pathname.startsWith("/settings")) setOpenSettings(true);
    if (location.pathname.startsWith("/control")) setOpenControl(true);
    if (location.pathname.startsWith("/compliance")) setOpenCompliance(true);
  }, [location.pathname]);

useEffect(() => {
  if (location.pathname.startsWith("/control")) setOpenControl(true);
}, [location.pathname]);


  // 🔹 Multi-language text
  const text = {
  en: {
  hotelManagement: "Hotel Management",
  dashboard: "Dashboard",
  frontDesk: "Front Desk",
  reservation: "Reservation",
  housekeeping: "Housekeeping",
  rooms: "Rooms",
  manageRooms: "Manage Rooms",
  viewRooms: "View Rooms",
  liveStatus: "Live Status",
  overview: "Overview",
  roomTypes: "Room Types",
  roomNumbers: "Room Numbers",
  addRoom: "Add Room",
  viewAllRooms: "View All Rooms",
  staff: "Staff Management",
  qr: "QR Code Management",
  inventory: "Inventory",
  reports: "Reports",
  settings: "Settings",
  generalSettings: "General Settings",
  frontendSettings: "Frontend Settings",
  languages: "Languages",
  currency: "Currency",
control: "Control",
rules: "Rules",
emailSettings: "Email Settings",
smsSettings: "SMS Settings",
superAdmin: "Super Admin",
 compliance: "Compliance",
      complianceOverview: "Overview",
      complianceRegister: "Compliance Register",
      evidenceVault: "Evidence Vault",
      violations: "Violations",
      auditTimeline: "Audit Timeline",
      complianceReports: "Compliance Reports",
      complianceDashboard:"Compliance Dashboard",
  logout: "Logout",
},

    hi: {
  hotelManagement: "होटल प्रबंधन",
  dashboard: "होटल डैशबोर्ड",
  frontDesk: "फ्रंट डेस्क",
  reservation: "आरक्षण",
  housekeeping: "हाउसकीपिंग",

  // Rooms
  rooms: "कमरे",
  manageRooms: "कमरों का प्रबंधन",
  viewRooms: "कमरे देखें",
  liveStatus: "लाइव स्थिति",
  overview: "सारांश",
  roomTypes: "कमरे के प्रकार",
  roomNumbers: "कमरा नंबर",
  addRoom: "कमरा जोड़ें",
  viewAllRooms: "सभी कमरे देखें",

  // Staff & Others
  staff: "स्टाफ प्रबंधन",
  qr: "QR कोड प्रबंधन",
  inventory: "इन्वेंटरी",
  reports: "रिपोर्ट्स",

  // Settings
  settings: "सेटिंग्स",
  generalSettings: "सामान्य सेटिंग्स",
  frontendSettings: "फ्रंटएंड सेटिंग्स",
  languages: "भाषा",
  currency: "मुद्रा",
control: "नियंत्रण",
rules: "नियम",
superAdmin: "सुपर एडमिन",

emailSettings: "ईमेल सेटिंग्स",
smsSettings: "एसएमएस सेटिंग्स",

  logout: "लॉगआउट",
},

    ar: {
  hotelManagement: "إدارة الفندق",
  dashboard: "لوحة التحكم",
  frontDesk: "الاستقبال",
  reservation: "الحجوزات",
  housekeeping: "التدبير المنزلي",

  // Rooms
  rooms: "الغرف",
  manageRooms: "إدارة الغرف",
  viewRooms: "عرض الغرف",
  liveStatus: "الحالة المباشرة",
  overview: "نظرة عامة",
  roomTypes: "أنواع الغرف",
  roomNumbers: "أرقام الغرف",
  addRoom: "إضافة غرفة",
  viewAllRooms: "عرض جميع الغرف",

  // Staff & Others
  staff: "إدارة الموظفين",
  qr: "إدارة رمز QR",
  inventory: "المخزون",
  reports: "التقارير",

  // Settings
  settings: "الإعدادات",
  generalSettings: "الإعدادات العامة",
  frontendSettings: "إعدادات الواجهة الأمامية",
  emailSettings: "إعدادات البريد الإلكتروني",
smsSettings: "إعدادات الرسائل النصية",

  languages: "اللغة",
  currency: "العملة",
control: "التحكم",
rules: "القواعد",
superAdmin: "المشرف العام",

  logout: "تسجيل الخروج",
},

  };

  const t = text[language] || text.en;

  // 🔹 Handlers
  const handleDashboardClick = () => {
    setOpenDashboard((prev) => !prev);
    navigate("/dashboard");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>
          <span className="accent-bar" />
          Hotel-name
        </h2>
        <p>{t.hotelManagement}</p>
      </div>

      <ul className="sidebar-menu">
        {/* Dashboard */}
        <li>
          <div className="menu-item" onClick={handleDashboardClick}>
            <Tooltip text={TOOLTIP_TEXT.DASHBOARD_OVERVIEW}>
              <FaHome />
            </Tooltip>
            <span>{t.dashboard}</span>
            <FaChevronDown className={`chevron ${openDashboard ? "open" : ""}`} />
          </div>
          {openDashboard && (
            <ul className="submenu">
              <li>
                <Tooltip text={TOOLTIP_TEXT.LIVE_STATUS}>
                  <NavLink to="/dashboard/live-status">{t.liveStatus} </NavLink>
                </Tooltip>
              </li>
              <li>
                <Tooltip text={TOOLTIP_TEXT.OVERVIEW}>
                  <NavLink to="/dashboard/overview">{t.overview}</NavLink>
                </Tooltip>
              </li>
            </ul>
          )}
        </li>

        {/* Front Desk */}
        <li>
          <NavLink to="/front-desk" className="menu-item">
            <Tooltip text={TOOLTIP_TEXT.FRONT_DESK}>
              <FaUserTie />
            </Tooltip>
            <span>{t.frontDesk}</span>
          </NavLink>
        </li>

        {/* Reservation */}
        <li>
          <NavLink to="/reservation" className="menu-item">
            <Tooltip text={TOOLTIP_TEXT.RESERVATION}>
              <FaClipboardList />
            </Tooltip>
            <span>{t.reservation}</span>
          </NavLink>
        </li>

        {/* Housekeeping */}
        <li>
          <NavLink to="/housekeeping" className="menu-item">
            <Tooltip text={TOOLTIP_TEXT.HOUSEKEEPING}>
              <FaBroom />
            </Tooltip>
            <span>{t.housekeeping}</span>
          </NavLink>
        </li>

        <div className="sidebar-divider" />

        {/* Rooms */}
        <li>
          <div className="menu-item" onClick={() => setOpenRooms(!openRooms)}>
            <Tooltip text={TOOLTIP_TEXT.ROOMS_OVERVIEW}>
              <FaDoorOpen />
            </Tooltip>
            <span>{t.rooms}</span>
            <FaChevronDown className={`chevron ${openRooms ? "open" : ""}`} />
          </div>
          {openRooms && (
           <ul className="submenu">
  <li>
    <Tooltip text={TOOLTIP_TEXT.MANAGE_ROOMS}>
      <NavLink to="/rooms/manage">{t.manageRooms}</NavLink>
    </Tooltip>
  </li>

  <li>
    <Tooltip text={TOOLTIP_TEXT.ADD_ROOM}>
      <NavLink to="/rooms/add">{t.addRoom}</NavLink>
    </Tooltip>
  </li>

  <li>
    <Tooltip text={TOOLTIP_TEXT.ROOM_TYPES}>
      <NavLink to="/rooms/types">{t.roomTypes}</NavLink>
    </Tooltip>
  </li>

  <li>
    <Tooltip text={TOOLTIP_TEXT.ROOM_NUMBERS}>
      <NavLink to="/rooms/numbers">{t.roomNumbers}</NavLink>
    </Tooltip>
  </li>

  <li>
    <Tooltip text={TOOLTIP_TEXT.VIEW_ALL_ROOMS}>
      <NavLink to="/rooms/viewall">{t.viewAllRooms}</NavLink>
    </Tooltip>
  </li>
</ul>

          )}
        </li>

        {/* Staff */}
        <li>
          <NavLink to="/staff" className="menu-item">
            <Tooltip text={TOOLTIP_TEXT.STAFF_OVERVIEW}>
              <FaUsers />
            </Tooltip>
            <span>{t.staff}</span>
          </NavLink>
        </li>

        {/* QR Code */}
        <li>
          <NavLink to="/qr" className="menu-item">
            <Tooltip text={TOOLTIP_TEXT.QR_OVERVIEW}>
              <FaQrcode />
            </Tooltip>
            <span>{t.qr}</span>
          </NavLink>
        </li>

        {/* Inventory */}
        <li>
          <NavLink to="/inventory" className="menu-item">
            <Tooltip text={TOOLTIP_TEXT.INVENTORY_OVERVIEW}>
              <FaBox />
            </Tooltip>
            <span>{t.inventory}</span>
          </NavLink>
        </li>

        {/* Reports */}
        <li>
          <NavLink to="/reports" className="menu-item">
            <Tooltip text={TOOLTIP_TEXT.REPORTS_OVERVIEW}>
              <FaChartBar />
            </Tooltip>
            <span>{t.reports}</span>
          </NavLink>
        </li>

        <div className="sidebar-divider" />
{/* Control */}
<li>
  <div className="menu-item" onClick={() => setOpenControl(!openControl)}>
    <Tooltip text=" Rules Control">
      <FaCog />
    </Tooltip>
    <span>{t.control}</span>
    <FaChevronDown className={`chevron ${openControl ? "open" : ""}`} />
  </div>

  {openControl && (
    <ul className="submenu">
      <li>
        <NavLink to="/control/rules">{t.rules}</NavLink>
      </li>
    </ul>
  )}
</li>


        {/* Settings */}
        <li>
          <div className="menu-item" onClick={() => setOpenSettings(!openSettings)}>
            <Tooltip text={TOOLTIP_TEXT.SETTINGS_OVERVIEW}>
              <FaCog />
            </Tooltip>
            <span>{t.settings}</span>
            <FaChevronDown className={`chevron ${openSettings ? "open" : ""}`} />
          </div>
         {openSettings && (
  <ul className="submenu">
    <li>
      <Tooltip text={TOOLTIP_TEXT.GENERAL_SETTINGS}>
        <NavLink to="/settings/general">{t.generalSettings}</NavLink>
      </Tooltip>
    </li>

    <li>
      <Tooltip text={TOOLTIP_TEXT.FRONTEND_SETTINGS}>
        <NavLink to="/settings/frontend">{t.frontendSettings}</NavLink>
      </Tooltip>
    </li>

    {/* ✅ NEW EMAIL SETTINGS */}
    <li>
      <Tooltip text="Email Configuration">
        <NavLink to="/settings/email">{t.emailSettings}</NavLink>
      </Tooltip>
    </li>

    {/* ✅ NEW SMS SETTINGS */}
    <li>
      <Tooltip text="SMS Configuration">
        <NavLink to="/settings/sms">{t.smsSettings}</NavLink>
      </Tooltip>
    </li>

    <li>
      <Tooltip text={TOOLTIP_TEXT.LANGUAGES_SETTINGS}>
        <NavLink to="/settings/languages">
          {t.languages}
        </NavLink>
      </Tooltip>
    </li>
  </ul>
)}

        </li>
<li>
  <NavLink
    to="/super-admin"
    className="menu-item"
  >
    <Tooltip text="Super Admin Panel">
      <FaShieldAlt />
    </Tooltip>
    <span>{t.superAdmin}</span>
  </NavLink>
</li>
  <li>
          <div className="menu-item" onClick={() => setOpenCompliance(!openCompliance)}>
            <FaShieldAlt />
            <span>{t.compliance}</span>
            <FaChevronDown className={`chevron ${openCompliance ? "open" : ""}`} />
          </div>

          {openCompliance && (
            <ul className="submenu">
              <li><NavLink to="/compliance/overview">{t.complianceOverview}</NavLink></li>
              <li><NavLink to="/compliance/register">{t.complianceRegister}</NavLink></li>
              <li><NavLink to="/compliance/evidence">{t.evidenceVault}</NavLink></li>
              <li><NavLink to="/compliance/violations">{t.violations}</NavLink></li>
              <li><NavLink to="/compliance/audit">{t.auditTimeline}</NavLink></li>
              <li><NavLink to="/compliance/reports">{t.complianceReports}</NavLink></li>
              <li>
 <NavLink to="/compliance/dashboard">{t.complianceDashboard}</NavLink>
</li>
            </ul>
          )}
        </li>

        {/* Logout */}
        <li>
          <NavLink to="/logout" className="menu-item logout">
            <Tooltip text={TOOLTIP_TEXT.LOGOUT}>
              <FaSignOutAlt />
            </Tooltip>
            <span>{t.logout}</span>
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
