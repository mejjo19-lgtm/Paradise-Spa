/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import logo from "./logo.png";

// 🖼️ CARDS
import card0 from "./cards/Card0.png";
import card1 from "./cards/Card1.png";
import card2 from "./cards/Card2.png";
import card3 from "./cards/Card3.png";
import card4 from "./cards/Card4.png";
import card5 from "./cards/Card5.png";
import card5free from "./cards/Card5Free.png";
import card6 from "./cards/Card6.png";
import card7 from "./cards/Card7.png";
import card8 from "./cards/Card8.png";
import card9 from "./cards/Card9.png";
import card10 from "./cards/Card10.png";
import welcomeWoman from "./welcome-boards/woman.jpeg";
import welcomeMan from "./welcome-boards/man.jpeg";
import welcomeBirthday from "./welcome-boards/birthday.jpeg";
import welcomePregnant from "./welcome-boards/pregnant.jpeg";
import welcomeBride from "./welcome-boards/bride.jpeg";
import welcomeGraduation from "./welcome-boards/graduation.jpeg";
import availableAppointmentsTemplate from "./available-appointments/available-template.png";
import { supabase, supabaseKey, supabaseUrl } from "./supabase";

function App() {
  const [screen, setScreen] = useState("welcome");
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedLoyaltyClientId, setSelectedLoyaltyClientId] = useState(null);
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [loggedInUser, setLoggedInUser] = useState("");
const [authReady, setAuthReady] = useState(false);
const scheduleLastEditRef = useRef(0);
const dailyManualLastEditRef = useRef(0);
const scheduleSettingsLastEditRef = useRef(0);
const financeSettingsLastEditRef = useRef(0);
const sharedDataMetaRef = useRef({});
const sharedDataDeviceIdRef = useRef(`${Date.now()}-${Math.random().toString(36).slice(2)}`);
const scheduleEditingRef = useRef(false);
const scheduleRowSaveTimersRef = useRef({});
const dailyReportSaveTimersRef = useRef({});
const incomeExpenseLoadedRangesRef = useRef({});
const sharedDataSaveDelay = 800;
const sharedDataEditProtectionDelay = 3000;
const isSharedDataInputFocused = () => {
  if (typeof document === "undefined") return false;

  const activeElement = document.activeElement;
  const activeTag = activeElement?.tagName;

  return ["INPUT", "SELECT", "TEXTAREA"].includes(activeTag);
};
const [scheduleSelection, setScheduleSelection] = useState(null);
const [scheduleActiveCell, setScheduleActiveCell] = useState(null);
const scheduleSelectingRef = useRef(false);
const scheduleResizeRef = useRef(null);
const [welcomeBoardName, setWelcomeBoardName] = useState("");
const welcomeBoardFonts = [
  {
    id: "riwaya-29lt-only",
    name: "29LT Riwaya Informal font",
    font: '"Riwaya29LTOnly"',
  },
  {
    id: "cormorant-upright-bold",
    name: "Cormorant Upright Bold",
    font: '"CormorantUprightBold"',
  },
  {
    id: "riwaya",
    name: "Riwaya Informal",
    font: '"LTRiwayaInformal"',
  },
  {
    id: "cormorant-regular",
    name: "Cormorant Regular",
    font: '"CormorantRegular"',
  },
  {
    id: "cormorant-upright",
    name: "Cormorant Upright",
    font: '"CormorantUpright"',
  },
  {
    id: "diphylleia",
    name: "Diphylleia",
    font: '"Diphylleia"',
  },
  {
    id: "cormorant",
    name: "Cormorant Italic",
    font: '"CormorantItalic"',
  },
  {
    id: "segoe",
    name: "Segoe Script",
    font: '"Segoe Script"',
  },
  {
    id: "cursive",
    name: "Classic Cursive",
    font: "cursive",
  },
  {
    id: "georgia",
    name: "Georgia Italic",
    font: "Georgia",
  },
];

const [selectedWelcomeFont, setSelectedWelcomeFont] = useState(() => {
  const savedFont = localStorage.getItem("selectedWelcomeFont") || "riwaya-29lt-only";
  return welcomeBoardFonts.some((font) => font.id === savedFont)
    ? savedFont
    : "riwaya-29lt-only";
});



const [welcomeFontSize, setWelcomeFontSize] = useState(() => {
  return Number(localStorage.getItem("welcomeFontSize")) || 0.56;
});

const [welcomeFontWeight, setWelcomeFontWeight] = useState(() => {
  const savedWeight = Number(localStorage.getItem("welcomeFontWeight") || 400);
  return Number.isFinite(savedWeight) ? savedWeight : 400;
});

const [welcomeTextTop, setWelcomeTextTop] = useState(() => {
  const savedTop = Number(localStorage.getItem("welcomeTextTop") || 39.9);
  return Number.isFinite(savedTop) ? savedTop : 39.9;
});

const [welcomeTextLeft, setWelcomeTextLeft] = useState(() => {
  const savedLeft = Number(localStorage.getItem("welcomeTextLeft") || 50);
  return Number.isFinite(savedLeft) ? savedLeft : 50;
});
const welcomeBoardAspectRatio = 3.7 / 5.1;
const defaultWelcomeBoardPrintHeight = 7.79;
const defaultWelcomeBoardPrintWidth = Number(
  (defaultWelcomeBoardPrintHeight * welcomeBoardAspectRatio).toFixed(2)
);
const [welcomeBoardPrintHeight, setWelcomeBoardPrintHeight] = useState(() => {
  return localStorage.getItem("welcomeBoardPrintHeight") || String(defaultWelcomeBoardPrintHeight);
});
const [welcomeBoardPrintWidth, setWelcomeBoardPrintWidth] = useState(() => {
  return localStorage.getItem("welcomeBoardPrintWidth") || String(defaultWelcomeBoardPrintWidth);
});
const [selectedWelcomeBoardId, setSelectedWelcomeBoardId] = useState("woman");
const [savedWelcomeBoards, setSavedWelcomeBoards] = useState([]);

  const [clients, setClients] = useState([]);
  const [clientsVisibleCount, setClientsVisibleCount] = useState(15);
  const [loyaltyVisibleCount, setLoyaltyVisibleCount] = useState(15);
const [giftVisibleCount] = useState(15);
  const [referralsVisibleCount, setReferralsVisibleCount] = useState(15);
  const [potentialVisibleCount, setPotentialVisibleCount] = useState(15);

  const getDisplayNameFromEmail = (email) => {
    const userKey = String(email || "").split("@")[0].toLowerCase();
    const displayNames = {
      majed: "ماجد",
      fatima: "فاطمة",
      tahani: "تهاني",
    };
    return displayNames[userKey] || "";
  };

  const createLoginEmail = (value) => {
    const userKey = String(value || "").trim().toLowerCase();
    return userKey ? `${userKey}@paradisespa.local` : "";
  };

useEffect(() => {
  let isMounted = true;

  const syncAuthSession = async () => {
    const { data } = await supabase.auth.getSession();
    const email = data?.session?.user?.email;

    if (!isMounted) return;

    if (email) {
      setIsLoggedIn(true);
      setLoggedInUser(getDisplayNameFromEmail(email) || "مستخدم");
    } else {
      setIsLoggedIn(false);
      setLoggedInUser("");
    }

    setAuthReady(true);
  };

  syncAuthSession();

  const { data: authListener } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      const email = session?.user?.email;

      if (email) {
        setIsLoggedIn(true);
        setLoggedInUser(getDisplayNameFromEmail(email) || "مستخدم");
        // التحميل يتم من useEffect مرة واحدة بعد تسجيل الدخول لتجنب سحب البيانات مرتين.
      } else {
        setIsLoggedIn(false);
        setLoggedInUser("");
        setClientsSafely([]);
      }

      setAuthReady(true);
    }
  );

  return () => {
    isMounted = false;
    authListener?.subscription?.unsubscribe();
  };
}, []);


useEffect(() => {
  if (!authReady) return;

  if (!isLoggedIn) {
    setClientsSafely([]);
    return;
  }

  const cacheLoaded = loadClientsFromCache();

if (!cacheLoaded) {
  fetchClients();
} else {
  setTimeout(() => {
    fetchClients();
  }, 3000);
}

  const clientsPolling = setInterval(() => {
    fetchClients();
  }, 86400000);

  const channel = supabase
    .channel("clients-sync")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "clients",
      },
      (payload) => {
        if (payload.eventType === "DELETE") {
          setClients((prev) =>
            prev.filter((client) => String(client.id) !== String(payload.old?.id))
          );
          return;
        }

        if (payload.new) {
          const nextClient = normalizeClientRecord(payload.new);
          setClients((prev) => {
            const exists = prev.some((client) => String(client.id) === String(nextClient.id));
            const nextClients = exists
              ? prev.map((client) =>
                  String(client.id) === String(nextClient.id) ? nextClient : client
                )
              : [nextClient, ...prev];

            return nextClients.sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
          });
        }
      }
    )
    .subscribe();

  return () => {
    clearInterval(clientsPolling);
    supabase.removeChannel(channel);
  };
}, [authReady, isLoggedIn]);

useEffect(() => {
  if (!authReady || !isLoggedIn) return;

  fetchSharedClientLists();

  const sharedListsPolling = setInterval(() => {
    fetchSharedClientLists();
  }, 86400000);

  const referralsChannel = supabase
    .channel("referred-clients-sync")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "referred_clients" },
      applyReferralChangeFromRealtime
    )
    .subscribe();

  const potentialChannel = supabase
    .channel("potential-clients-sync")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "potential_clients" },
      applyPotentialChangeFromRealtime
    )
    .subscribe();

  const giftChannel = supabase
    .channel("gift-clients-sync")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "gift_clients" },
      applyGiftChangeFromRealtime
    )
    .subscribe();

  return () => {
    clearInterval(sharedListsPolling);
    supabase.removeChannel(referralsChannel);
    supabase.removeChannel(potentialChannel);
    supabase.removeChannel(giftChannel);
  };
}, [authReady, isLoggedIn]);

useEffect(() => {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}, [screen]);

useEffect(() => {
  const handleClickOutsideSearch = (event) => {
    if (
      dashboardSearchRef.current &&
      !dashboardSearchRef.current.contains(event.target)
    ) {
      setShowDashboardSearchResults(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutsideSearch);
  document.addEventListener("touchstart", handleClickOutsideSearch);

  return () => {
    document.removeEventListener("mousedown", handleClickOutsideSearch);
    document.removeEventListener("touchstart", handleClickOutsideSearch);
  };
}, []);
const normalizeClientRecord = (client) => ({
  ...client,
  id: client.id,
  name: client.name || client.arabic_name || "",
  arabic_name: client.arabic_name || client.name || "",
  phone: client.phone || "",
  address: client.address || "",
  visits: Number(client.visits || 0),
  frame: Boolean(client.frame),
  blacklist: Boolean(client.blacklist),
  notes: client.notes || "",
  referrals: Array.isArray(client.referrals) ? client.referrals : [],
});

const CLIENTS_CACHE_KEY = "paradise-clients-cache";
const CLIENTS_CACHE_MAX_AGE = 30 * 60 * 1000;

const loadClientsFromCache = () => {
  try {
    const cached = JSON.parse(localStorage.getItem(CLIENTS_CACHE_KEY) || "null");

    if (!cached?.savedAt || !Array.isArray(cached.clients)) return false;

    const cacheAge = Date.now() - Number(cached.savedAt);

    if (cacheAge > CLIENTS_CACHE_MAX_AGE) return false;

    setClientsSafely(cached.clients, false);
    return true;
  } catch {
    return false;
  }
};

const saveClientsToCache = (nextClients) => {
  try {
    localStorage.setItem(
      CLIENTS_CACHE_KEY,
      JSON.stringify({
        savedAt: Date.now(),
        clients: nextClients || [],
      })
    );
  } catch (error) {
    console.log("Clients cache save error:", error);
  }
};

const setClientsSafely = (nextClients, saveCache = true) => {
  const normalizedClients = Array.isArray(nextClients)
    ? nextClients.map(normalizeClientRecord)
    : [];

  setClients(normalizedClients);

  if (saveCache) {
    saveClientsToCache(normalizedClients);
  }
};

async function fetchClientsWithSupabaseClient() {
  const pageSize = 1000;
  let allClients = [];
  let from = 0;
  let hasMore = true;

  while (hasMore) {
    const to = from + pageSize - 1;
    const { data, error } = await supabase
      .from("clients")
      .select("id,name,arabic_name,phone,address,visits,frame,blacklist")
      .order("id", { ascending: false })
      .range(from, to);

    if (error) {
      throw error;
    }

    const pageData = data || [];
    allClients = [...allClients, ...pageData];
    hasMore = pageData.length === pageSize;
    from += pageSize;
  }

  return allClients;
}

async function fetchClientsWithRestApi() {
  const pageSize = 1000;
  let allClients = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/clients?select=id,name,arabic_name,phone,address,visits,frame,blacklist&order=id.desc&limit=${pageSize}&offset=${offset}`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`REST clients fetch failed: ${response.status}`);
    }

    const pageData = await response.json();
    allClients = [...allClients, ...(pageData || [])];
    hasMore = Array.isArray(pageData) && pageData.length === pageSize;
    offset += pageSize;
  }

  return allClients;
}

async function fetchClients() {
  try {
    const allClients = await fetchClientsWithSupabaseClient();

    if (allClients.length > 0) {
      setClientsSafely(allClients);
      return;
    }

    const restClients = await fetchClientsWithRestApi();
    setClientsSafely(restClients);
  } catch (error) {
    console.log("Clients fetch error, trying REST fallback:", error);

    try {
      const restClients = await fetchClientsWithRestApi();
      setClientsSafely(restClients);
    } catch (restError) {
      console.log("Clients REST fallback fetch error:", restError);
      setClientsSafely([]);
    }
  }
}
async function fetchManualReferrals() {
  const { data, error } = await supabase
    .from("referred_clients")
    .select("*")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  setManualReferrals(
    (data || []).map((referral) => ({
      id: referral.id,
      name: referral.name || "",
      phone: referral.phone || "",
      sourceClientId: referral.source_client_id || null,
      sourceClientName: referral.source_client_name || "",
      sourceClientPhone: referral.source_client_phone || "",
      sourceReferralId: referral.source_referral_id || null,
      createdAt: referral.created_at || "",
      manual: true,
    }))
  );
}

async function fetchPotentialClients() {
  const { data, error } = await supabase
    .from("potential_clients")
    .select("*")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  setPotentialClients(
    (data || []).map((client) => ({
      id: client.id,
      name: client.name || "",
      phone: client.phone || "",
      status: client.status || "إلغاء موعد",
      createdAt: client.created_at || "",
    }))
  );
}

async function fetchGiftClients() {
  const { data, error } = await supabase
    .from("gift_clients")
    .select("*")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  setGiftClients(
    (data || []).map((gift) => ({
      id: gift.id,
      fromName: gift.from_name || "",
      fromPhone: gift.from_phone || "",
      toName: gift.to_name || "",
      toPhone: gift.to_phone || "",
      giftDate: gift.gift_date || gift.items?.giftDate || gift.created_at || "",
      service: gift.service || "",
      items: gift.items || { balloon: false, flowers: false, cake: false },
      giftTaken: Boolean(gift.items?.giftTaken),
      createdAt: gift.created_at || "",
    }))
  );
}


const normalizeManualReferralRecord = (referral) => ({
  id: referral.id,
  name: referral.name || "",
  phone: referral.phone || "",
  sourceClientId: referral.source_client_id || null,
  sourceClientName: referral.source_client_name || "",
  sourceClientPhone: referral.source_client_phone || "",
  sourceReferralId: referral.source_referral_id || null,
  createdAt: referral.created_at || "",
  manual: true,
});

const normalizePotentialClientRecord = (client) => ({
  id: client.id,
  name: client.name || "",
  phone: client.phone || "",
  status: client.status || "إلغاء موعد",
  createdAt: client.created_at || "",
});

const normalizeGiftClientRecord = (gift) => ({
  id: gift.id,
  fromName: gift.from_name || "",
  fromPhone: gift.from_phone || "",
  toName: gift.to_name || "",
  toPhone: gift.to_phone || "",
  giftDate: gift.gift_date || gift.items?.giftDate || gift.created_at || "",
  service: gift.service || "",
  items: gift.items || { balloon: false, flowers: false, cake: false },
  giftTaken: Boolean(gift.items?.giftTaken),
  createdAt: gift.created_at || "",
});

const upsertByIdNewestFirst = (setter, nextRecord) => {
  setter((prev) => {
    const exists = prev.some((item) => String(item.id) === String(nextRecord.id));
    const nextItems = exists
      ? prev.map((item) => String(item.id) === String(nextRecord.id) ? nextRecord : item)
      : [nextRecord, ...prev];

    return nextItems.sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
  });
};

const removeById = (setter, removedRecord) => {
  if (!removedRecord?.id) return;

  setter((prev) =>
    prev.filter((item) => String(item.id) !== String(removedRecord.id))
  );
};

const applyReferralChangeFromRealtime = (payload) => {
  if (payload.eventType === "DELETE") {
    removeById(setManualReferrals, payload.old);
    return;
  }

  if (payload.new) {
    upsertByIdNewestFirst(
      setManualReferrals,
      normalizeManualReferralRecord(payload.new)
    );
  }
};

const applyPotentialChangeFromRealtime = (payload) => {
  if (payload.eventType === "DELETE") {
    removeById(setPotentialClients, payload.old);
    return;
  }

  if (payload.new) {
    upsertByIdNewestFirst(
      setPotentialClients,
      normalizePotentialClientRecord(payload.new)
    );
  }
};

const applyGiftChangeFromRealtime = (payload) => {
  if (payload.eventType === "DELETE") {
    removeById(setGiftClients, payload.old);
    return;
  }

  if (payload.new) {
    upsertByIdNewestFirst(
      setGiftClients,
      normalizeGiftClientRecord(payload.new)
    );
  }
};


function fetchSharedClientLists() {
  fetchManualReferrals();
  fetchPotentialClients();
  fetchGiftClients();
}
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [search, setSearch] = useState("");
  const [clientsSearch, setClientsSearch] = useState("");
  const [loyaltyVisitsFilter, setLoyaltyVisitsFilter] = useState("");
  const [referralsSearch, setReferralsSearch] = useState("");
  const [referralsCustomerFilter, setReferralsCustomerFilter] = useState("all");
  const [manualReferrals, setManualReferrals] = useState([]);
  const [showReferralForm, setShowReferralForm] = useState(false);
  const [referralName, setReferralName] = useState("");
  const [referralPhone, setReferralPhone] = useState("");
  const [referralSourceName, setReferralSourceName] = useState("");
  const [referralSourcePhone, setReferralSourcePhone] = useState("");
  const [dashboardSearch, setDashboardSearch] = useState("");
  const [showDashboardSearchResults, setShowDashboardSearchResults] = useState(false);
  const [appointmentStaffSelections, setAppointmentStaffSelections] = useState({});
  const dashboardSearchRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const [showGlobalClientForm, setShowGlobalClientForm] = useState(false);

  const getCurrentLocalDate = () => {
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 10);
  };

  const [currentDate, setCurrentDate] = useState(() => getCurrentLocalDate());
  const [potentialClients, setPotentialClients] = useState([]);
  const [potentialSearch, setPotentialSearch] = useState("");
  const [potentialCustomerFilter, setPotentialCustomerFilter] = useState("all");
  const [showPotentialForm, setShowPotentialForm] = useState(false);
  const [potentialName, setPotentialName] = useState("");
  const [potentialPhone, setPotentialPhone] = useState("");
  const [potentialStatus, setPotentialStatus] = useState("إلغاء موعد");

  const [giftClients, setGiftClients] = useState([]);
  const [giftSearch, setGiftSearch] = useState("");
  const [giftStatusFilter, setGiftStatusFilter] = useState("all");
  const [showGiftForm, setShowGiftForm] = useState(false);
  const [giftFromName, setGiftFromName] = useState("");
  const [giftFromPhone, setGiftFromPhone] = useState("");
  const [giftToName, setGiftToName] = useState("");
  const [giftToPhone, setGiftToPhone] = useState("");
  const [giftService, setGiftService] = useState("");
  const [giftDate, setGiftDate] = useState(() => getCurrentLocalDate());
  const [giftItems, setGiftItems] = useState({
    balloon: false,
    flowers: false,
    cake: false,
  });

  const [editingReferralId, setEditingReferralId] = useState(null);
  const [editedReferralName, setEditedReferralName] = useState("");
  const [editedReferralPhone, setEditedReferralPhone] = useState("");
  const [editedReferralSourceName, setEditedReferralSourceName] = useState("");
  const [editedReferralSourcePhone, setEditedReferralSourcePhone] = useState("");

  const [editingGiftId, setEditingGiftId] = useState(null);
  const [editedGiftFromName, setEditedGiftFromName] = useState("");
  const [editedGiftFromPhone, setEditedGiftFromPhone] = useState("");
  const [editedGiftToName, setEditedGiftToName] = useState("");
  const [editedGiftToPhone, setEditedGiftToPhone] = useState("");
  const [editedGiftService, setEditedGiftService] = useState("");
  const [editedGiftItems, setEditedGiftItems] = useState({
    balloon: false,
    flowers: false,
    cake: false,
  });

  const [editingPotentialId, setEditingPotentialId] = useState(null);
  const [editedPotentialName, setEditedPotentialName] = useState("");
  const [editedPotentialPhone, setEditedPotentialPhone] = useState("");
  const [editedPotentialStatus, setEditedPotentialStatus] = useState("");

  const todayDate = currentDate;
  const [selectedScheduleDate, setSelectedScheduleDate] = useState(todayDate);
  const availablePosterRef = useRef(null);
  const availableAppointmentTimes = ["3:00", "4:00", "5:00", "6:00", "7:00", "8:00", "9:00", "10:00", "11:00"];
  const [availableAppointmentDate, setAvailableAppointmentDate] = useState(todayDate);
  const [availableAppointmentStatus, setAvailableAppointmentStatus] = useState(() =>
    availableAppointmentTimes.reduce((statusMap, time) => ({
      ...statusMap,
      [time]: "available",
    }), {})
  );

  const [scheduleData, setScheduleData] = useState({});

  const [dailyManualData, setDailyManualData] = useState(() => {
    const savedDaily = localStorage.getItem("paradise-daily-manual-data");
    return savedDaily ? JSON.parse(savedDaily) : {};
  });

  const [scheduleSettings, setScheduleSettings] = useState(() => {
    const savedSettings = localStorage.getItem("paradise-schedule-settings");
    return savedSettings ? JSON.parse(savedSettings) : {};
  });

  const [selectedFinanceMonth, setSelectedFinanceMonth] = useState("2026-05");
  const getDefaultIncomeExpensesFromMonth = () => {
  const now = new Date();
  now.setMonth(now.getMonth() - 2);

  return now.toISOString().slice(0, 7);
};

const [incomeExpensesFromMonth, setIncomeExpensesFromMonth] = useState(
  getDefaultIncomeExpensesFromMonth()
);
  const [incomeExpensesToMonth, setIncomeExpensesToMonth] = useState(() => getCurrentLocalDate().slice(0, 7));
  const [incomeExpensesEditMode, setIncomeExpensesEditMode] = useState(false);
  const [financeMonthlySettings, setFinanceMonthlySettings] = useState(() => {
    const savedSettings = localStorage.getItem("paradise-finance-monthly-settings");
    return savedSettings ? JSON.parse(savedSettings) : {};
  });

  const [sharedDataLoaded, setSharedDataLoaded] = useState(false);

  const sharedDataKeys = [
  "scheduleSettings",
  "financeMonthlySettings",
];

  const sharedDataLocalStorageKeys = {
    dailyManualData: "paradise-daily-manual-data",
    scheduleSettings: "paradise-schedule-settings",
    financeMonthlySettings: "paradise-finance-monthly-settings",
  };

  const getSharedDataLocalStorageKey = (dataKey) =>
    sharedDataLocalStorageKeys[dataKey] || `paradise-${dataKey}`;

  const getSharedDataMetaKey = (dataKey) => `${dataKey}Meta`;

  const getSharedDataBackupKey = (dataKey) => `${dataKey}Backup`;

  const getSharedDataLastEditTime = (dataKey) => {
    if (dataKey === "scheduleData") return scheduleLastEditRef.current;
    if (dataKey === "dailyManualData") return dailyManualLastEditRef.current;
    if (dataKey === "scheduleSettings") return scheduleSettingsLastEditRef.current;
    if (dataKey === "financeMonthlySettings") return financeSettingsLastEditRef.current;
    return 0;
  };

  const saveSharedDataLocalBackup = (dataKey, dataValue, source) => {
    try {
      const backupRecord = {
        source,
        savedAt: new Date().toISOString(),
        data: dataValue,
      };
      const storageKey = getSharedDataLocalStorageKey(dataKey);

      localStorage.setItem(
        `${storageKey}-backup-latest`,
        JSON.stringify(backupRecord)
      );
    } catch (backupError) {
      console.log("Shared data local backup error:", backupError);
    }
  };

  const saveSharedData = async (dataKey, dataValue) => {
    if (!sharedDataKeys.includes(dataKey)) return;

    saveSharedDataLocalBackup(dataKey, dataValue, "before-save-local");

    const metaKey = getSharedDataMetaKey(dataKey);
    const backupKey = getSharedDataBackupKey(dataKey);

    const { data: existingRows, error: loadError } = await supabase
      .from("app_data")
      .select("data_key, data")
      .in("data_key", [dataKey, metaKey]);

    if (loadError) {
      console.log("Shared data pre-save check error:", loadError);
      return;
    }

    const existingDataRow = existingRows?.find((row) => row.data_key === dataKey);
    const existingMetaRow = existingRows?.find((row) => row.data_key === metaKey);
    const remoteMeta = existingMetaRow?.data || {};
    const knownMeta = sharedDataMetaRef.current[dataKey] || {};
    const remoteUpdatedAt = Number(remoteMeta.updatedAt || 0);
    const knownUpdatedAt = Number(knownMeta.updatedAt || 0);
    const remoteDeviceId = remoteMeta.deviceId || "";

    if (
      remoteUpdatedAt > knownUpdatedAt &&
      remoteDeviceId &&
      remoteDeviceId !== sharedDataDeviceIdRef.current
    ) {
      saveSharedDataLocalBackup(dataKey, dataValue, "blocked-stale-overwrite");
      console.log(
        `Blocked stale ${dataKey} save to protect newer Supabase data. Refresh/load the latest data before saving again.`
      );
      return;
    }



    const nextMeta = {
      dataKey,
      updatedAt: Date.now(),
      updatedAtIso: new Date().toISOString(),
      deviceId: sharedDataDeviceIdRef.current,
      lastLocalEditAt: getSharedDataLastEditTime(dataKey),
    };

    const { error } = await supabase
      .from("app_data")
      .upsert(
        {
          data_key: dataKey,
          data: dataValue,
        },
        { onConflict: "data_key" }
      );

    if (error) {
      console.log("Shared data save error:", error);
      return;
    }

    const { error: metaError } = await supabase
      .from("app_data")
      .upsert(
        {
          data_key: metaKey,
          data: nextMeta,
        },
        { onConflict: "data_key" }
      );

    if (metaError) {
      console.log("Shared data meta save error:", metaError);
      return;
    }

    sharedDataMetaRef.current[dataKey] = nextMeta;
    saveSharedDataLocalBackup(dataKey, dataValue, "after-save-success");
  };

  const loadSharedData = async () => {
    const keysToLoad = [
      ...sharedDataKeys,
      ...sharedDataKeys.map(getSharedDataMetaKey),
    ];

    const { data, error } = await supabase
      .from("app_data")
      .select("data_key, data")
      .in("data_key", keysToLoad);

    if (error) {
      console.log("Shared data load error:", error);
      setSharedDataLoaded(true);
      return;
    }

    
    const settingsRow = data?.find((row) => row.data_key === "scheduleSettings");
    const financeSettingsRow = data?.find((row) => row.data_key === "financeMonthlySettings");

    sharedDataKeys.forEach((dataKey) => {
      const metaRow = data?.find((row) => row.data_key === getSharedDataMetaKey(dataKey));
      if (metaRow?.data) {
        sharedDataMetaRef.current[dataKey] = metaRow.data;
      }
    });

    const now = Date.now();
    const userIsEditingSharedData = isSharedDataInputFocused();
    
    const recentlyEditedScheduleSettings =
      userIsEditingSharedData ||
      now - scheduleSettingsLastEditRef.current < sharedDataEditProtectionDelay;
    const recentlyEditedFinanceSettings =
      userIsEditingSharedData ||
      now - financeSettingsLastEditRef.current < sharedDataEditProtectionDelay;

    

    if (settingsRow?.data && !recentlyEditedScheduleSettings) {
      setScheduleSettings(settingsRow.data);
      localStorage.setItem("paradise-schedule-settings", JSON.stringify(settingsRow.data));
      saveSharedDataLocalBackup("scheduleSettings", settingsRow.data, "after-load-supabase");
    }

    if (financeSettingsRow?.data && !recentlyEditedFinanceSettings) {
      setFinanceMonthlySettings(financeSettingsRow.data);
      localStorage.setItem(
        "paradise-finance-monthly-settings",
        JSON.stringify(financeSettingsRow.data)
      );
      saveSharedDataLocalBackup(
        "financeMonthlySettings",
        financeSettingsRow.data,
        "after-load-supabase"
      );
    }

    setSharedDataLoaded(true);
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    loadSharedData();

    const appDataPolling = setInterval(() => {
      loadSharedData();
    }, 86400000);

    const appDataChannel = supabase
  .channel("app-data-sync")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "app_data",
    },
    (payload) => {
      const changedKey = payload?.new?.data_key || payload?.old?.data_key || "";
      const changedData = payload?.new?.data;

      if (!sharedDataKeys.includes(changedKey)) return;
      if (!changedData) return;

      const now = Date.now();
      const userIsEditingSharedData = isSharedDataInputFocused();

     

      if (
        changedKey === "scheduleSettings" &&
        !userIsEditingSharedData &&
        now - scheduleSettingsLastEditRef.current >= sharedDataEditProtectionDelay
      ) {
        setScheduleSettings(changedData);
        localStorage.setItem("paradise-schedule-settings", JSON.stringify(changedData));
        saveSharedDataLocalBackup("scheduleSettings", changedData, "after-realtime-direct");
      }

      if (
        changedKey === "financeMonthlySettings" &&
        !userIsEditingSharedData &&
        now - financeSettingsLastEditRef.current >= sharedDataEditProtectionDelay
      ) {
        setFinanceMonthlySettings(changedData);
        localStorage.setItem(
          "paradise-finance-monthly-settings",
          JSON.stringify(changedData)
        );
        saveSharedDataLocalBackup(
          "financeMonthlySettings",
          changedData,
          "after-realtime-direct"
        );
      }
    }
  )
  .subscribe();

    return () => {
      clearInterval(appDataPolling);
      supabase.removeChannel(appDataChannel);
    };
  }, [isLoggedIn]);


  // 💾 SCHEDULE DATA
  // الجدول لا ينحفظ في localStorage ولا app_data.
  // الحفظ الحقيقي للمواعيد يتم فقط داخل schedule_rows، صف بصف.
const loadDailyReportForDate = async (date) => {
  if (!date) return;

  const { data, error } = await supabase
    .from("daily_reports")
    .select("report_date, report_data, updated_at, updated_by")
    .eq("report_date", date)
    .maybeSingle();

  if (error) {
    console.log("Daily report load error:", error);
    return;
  }

  if (data?.report_data) {
    setDailyManualData((prev) => ({
      ...prev,
      [date]: data.report_data,
    }));
  }
};

const saveDailyReportForDate = async (date, reportData) => {
  if (!date) return;

  const { error } = await supabase.from("daily_reports").upsert(
    {
      report_date: date,
      report_data: reportData || {},
      updated_at: new Date().toISOString(),
      updated_by: sharedDataDeviceIdRef.current,
    },
    { onConflict: "report_date" }
  );

  if (error) {
    console.log("Daily report save error:", error);
  }
};

const queueDailyReportSave = (date, reportData) => {
  if (!date) return;

  if (dailyReportSaveTimersRef.current[date]) {
    clearTimeout(dailyReportSaveTimersRef.current[date]);
  }

  dailyReportSaveTimersRef.current[date] = setTimeout(() => {
    saveDailyReportForDate(date, reportData);
    delete dailyReportSaveTimersRef.current[date];
  }, 700);
};

useEffect(() => {
  localStorage.setItem(
    "paradise-daily-manual-data",
    JSON.stringify(dailyManualData)
  );
}, [dailyManualData]);

useEffect(() => {
  if (!isLoggedIn || !selectedScheduleDate) return undefined;

  loadDailyReportForDate(selectedScheduleDate);

  const dailyReportsChannel = supabase
    .channel("daily-reports-sync")
    .on(
  "postgres_changes",
  {
    event: "*",
    schema: "public",
    table: "daily_reports",
  
  },
      (payload) => {
        if (payload.eventType === "DELETE") {
          const removedDate = payload.old?.report_date;
          if (!removedDate) return;

          setDailyManualData((prev) => {
            const next = { ...prev };
            delete next[removedDate];
            return next;
          });
          return;
        }

        const record = payload.new;
        const reportDate = record?.report_date;

        if (!reportDate) return;
        if (record?.updated_by === sharedDataDeviceIdRef.current) return;

        const now = Date.now();
        const userIsEditingSharedData = isSharedDataInputFocused();

        if (
          reportDate === selectedScheduleDate &&
          userIsEditingSharedData &&
          now - dailyManualLastEditRef.current < sharedDataEditProtectionDelay
        ) {
          return;
        }

        setDailyManualData((prev) => ({
          ...prev,
          [reportDate]: record.report_data || {},
        }));
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(dailyReportsChannel);
  };
}, [isLoggedIn, selectedScheduleDate]);

  // 💾 SAVE SCHEDULE SETTINGS
  useEffect(() => {
    localStorage.setItem(
      "paradise-schedule-settings",
      JSON.stringify(scheduleSettings)
    );

    if (!sharedDataLoaded) return undefined;

    const saveTimer = setTimeout(() => {
      saveSharedData("scheduleSettings", scheduleSettings);
    }, sharedDataSaveDelay);

    return () => clearTimeout(saveTimer);
  }, [scheduleSettings, sharedDataLoaded]);

  // 💾 SAVE FINANCE MONTHLY SETTINGS
  useEffect(() => {
    localStorage.setItem(
      "paradise-finance-monthly-settings",
      JSON.stringify(financeMonthlySettings)
    );

    if (!sharedDataLoaded) return undefined;

    const saveTimer = setTimeout(() => {
      saveSharedData("financeMonthlySettings", financeMonthlySettings);
    }, sharedDataSaveDelay);

    return () => clearTimeout(saveTimer);
  }, [financeMonthlySettings, sharedDataLoaded]);

  useEffect(() => {
    const updateTodayDate = () => {
      const newToday = getCurrentLocalDate();
      setCurrentDate((previousDate) => {
        if (previousDate !== newToday) {
          setSelectedScheduleDate(newToday);
        }
        return newToday;
      });
    };

    updateTodayDate();
    const dateTimer = setInterval(updateTodayDate, 60000);

    return () => clearInterval(dateTimer);
  }, []);


useEffect(() => {
  if (!isLoggedIn) return;
  if (screen !== "incomeExpenses") return;

  loadIncomeExpenseReportDataRange(
    incomeExpensesFromMonth,
    incomeExpensesToMonth
  );
}, [isLoggedIn, screen, incomeExpensesFromMonth, incomeExpensesToMonth]);

  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedPhone, setEditedPhone] = useState("");
  const [editedAddress, setEditedAddress] = useState("");

  const [profileNotes, setProfileNotes] = useState("");
  const [profileBlacklist, setProfileBlacklist] = useState(false);
  const [profileFrame, setProfileFrame] = useState(false);
  const [profileReferrals, setProfileReferrals] = useState([]);


  const normalizeDigits = (value) => String(value || "").replace(/\D/g, "");

  const formatSaudiPhoneForStorage = (value) => {
    let digits = normalizeDigits(value);

    if (digits.startsWith("00966")) {
      digits = "0" + digits.slice(5);
    } else if (digits.startsWith("966")) {
      digits = "0" + digits.slice(3);
    } else if (digits.startsWith("5")) {
      digits = "0" + digits;
    }

    return digits;
  };

  const phoneMatchesSearch = (phoneValue, searchValue) => {
    const rawSearch = normalizeDigits(searchValue);
    if (!rawSearch) return false;

    const storedPhone = normalizeDigits(phoneValue);
    const localPhone = formatSaudiPhoneForStorage(phoneValue);
    const internationalPhone = cleanSaudiPhone(localPhone || storedPhone);
    const localWithoutZero = localPhone.startsWith("0")
      ? localPhone.slice(1)
      : localPhone;
    const searchAsLocal = formatSaudiPhoneForStorage(searchValue);
    const searchAsInternational = cleanSaudiPhone(searchAsLocal || rawSearch);
    const searchWithoutZero = searchAsLocal.startsWith("0")
      ? searchAsLocal.slice(1)
      : searchAsLocal;

    const phoneVariants = [
      storedPhone,
      localPhone,
      internationalPhone,
      localWithoutZero,
    ].filter(Boolean);

    const searchVariants = [
      rawSearch,
      searchAsLocal,
      searchAsInternational,
      searchWithoutZero,
    ].filter(Boolean);

    return phoneVariants.some((phoneVariant) =>
      searchVariants.some(
        (searchVariant) =>
          phoneVariant.includes(searchVariant) || searchVariant.includes(phoneVariant)
      )
    );
  };

  // ➕ ADD CLIENT
  const addClient = async () => {
    if (!name || !phone) return;

    const cleanNewPhone = formatSaudiPhoneForStorage(phone);

    const phoneExists = clients.some(
      (c) => formatSaudiPhoneForStorage(c.phone) === cleanNewPhone
    );

    if (phoneExists) {
      const confirmDuplicate = window.confirm(
        "هذا الرقم موجود مسبقاً، هل تريد إضافة العميلة رغم ذلك؟"
      );

      if (!confirmDuplicate) return;
    }

   const { data: insertedClient, error } = await supabase.from("clients").insert([
  {
    name,
    arabic_name: name,
    phone: cleanNewPhone,
    address,
    visits: 0,
    frame: false,
    blacklist: false,
    notes: "",
    total_paid: 0,
    service_history: [],
  },
]).select("id,name,arabic_name,phone,address,visits,frame,blacklist").single();

if (error) {
  console.error("ADD CLIENT ERROR:", error);
  console.error("ADD CLIENT ERROR JSON:", JSON.stringify(error, null, 2));
  alert("لم يتم حفظ العميلة. تأكد من الاتصال وجرب مرة ثانية.");
  return;
}

if (insertedClient) {
  const nextClient = normalizeClientRecord(insertedClient);

  setClients((prev) => {
    const exists = prev.some((client) => String(client.id) === String(nextClient.id));
    const nextClients = exists
      ? prev.map((client) => String(client.id) === String(nextClient.id) ? nextClient : client)
      : [nextClient, ...prev];

    return nextClients.sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
  });

  setName("");
  setPhone("");
  setAddress("");
  setShowForm(false);
setShowGlobalClientForm(false);
}
  };

  // ✏️ START EDIT CLIENT
  const startEditClient = (client) => {
    setEditingId(client.id);
    setEditedName(client.name);
    setEditedPhone(client.phone);
    setEditedAddress(client.address || "");
  };

  // 💾 SAVE EDIT CLIENT
  const saveEditClient = async (id) => {
    if (!editedName || !editedPhone) return;

const { data: updatedClient, error } = await supabase
  .from("clients")
  .update({
    name: editedName,
    arabic_name: editedName,
    phone: formatSaudiPhoneForStorage(editedPhone),
    address: editedAddress,
  })
  .eq("id", id)
  .select("id,name,arabic_name,phone,address,visits,frame,blacklist")
  .single();

if (error) {
  console.log("Client edit save error:", error);
  alert("لم يتم حفظ تعديل العميلة. تأكد من الاتصال وجرب مرة ثانية.");
  return;
} else if (updatedClient) {
  const nextClient = normalizeClientRecord(updatedClient);
  setClients((prev) =>
    prev.map((client) => String(client.id) === String(nextClient.id) ? nextClient : client)
  );
}

    setEditingId(null);
    setEditedName("");
    setEditedPhone("");
    setEditedAddress("");
  };

  // ❌ CANCEL EDIT CLIENT
  const cancelEditClient = () => {
    setEditingId(null);
    setEditedName("");
    setEditedPhone("");
    setEditedAddress("");
  };

  // 🗑️ DELETE CLIENT
  const deleteClient = async (client) => {
    if (!client?.id) return;

    const confirmDelete = window.confirm(
      `هل أنت متأكد من حذف العميلة ${client.name || ""}؟\nلا يمكن التراجع عن الحذف.`
    );

    if (!confirmDelete) return;

    const { error } = await supabase.from("clients").delete().eq("id", client.id);

    if (error) {
      console.log("Client delete error:", error);
      alert("لم يتم حذف العميلة. تأكد من الاتصال وجرب مرة ثانية.");
      return;
    }

    setSelectedLoyaltyClientId(null);
    setSelectedClientId(null);
    setClients((prev) => prev.filter((clientItem) => String(clientItem.id) !== String(client.id)));
  };

  const getSharedReferralsForClient = async (clientId) => {
    const { data, error } = await supabase
      .from("referred_clients")
      .select("*")
      .eq("source_client_id", String(clientId))
      .order("created_at", { ascending: false })
      .order("id", { ascending: false });

    if (error) {
      console.log("Profile referrals load error:", error);
      return [];
    }

    return (data || []).map((referral) => ({
      id: referral.source_referral_id || referral.id || Date.now(),
      name: referral.name || "",
      phone: referral.phone || "",
    }));
  };

  const syncProfileReferralsToSharedList = async (clientId, referrals) => {
    const sourceClient = clients.find((client) => String(client.id) === String(clientId));
    const sourceName = sourceClient?.name || selectedClient?.name || "";
    const sourcePhone = sourceClient?.phone || selectedClient?.phone || "";

    const { data: existingRows, error: loadError } = await supabase
      .from("referred_clients")
      .select("*")
      .eq("source_client_id", String(clientId));

    if (loadError) {
      console.log("Profile referrals load before sync error:", loadError);
      return false;
    }

    const cleanReferrals = referrals
      .filter((referral) => referral.name || referral.phone)
      .map((referral, index) => ({
        id: String(referral.id || `${Date.now()}-${index}`),
        name: referral.name || "",
        phone: formatSaudiPhoneForStorage(referral.phone || ""),
      }));

    const existingBySourceId = new Map(
      (existingRows || []).map((row) => [
        String(row.source_referral_id || row.id),
        row,
      ])
    );

    const nextSourceIds = new Set(cleanReferrals.map((referral) => referral.id));

    const rowsToDelete = (existingRows || []).filter(
      (row) => !nextSourceIds.has(String(row.source_referral_id || row.id))
    );

    if (rowsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from("referred_clients")
        .delete()
        .in(
          "id",
          rowsToDelete.map((row) => row.id)
        );

      if (deleteError) {
        console.log("Profile referrals delete removed error:", deleteError);
        return false;
      }
    }

    for (const referral of cleanReferrals) {
      const existingReferral = existingBySourceId.get(referral.id);

      if (existingReferral) {
        const { error: updateError } = await supabase
          .from("referred_clients")
          .update({
            name: referral.name,
            phone: referral.phone,
            source_client_name: sourceName,
            source_client_phone: sourcePhone,
            source_referral_id: referral.id,
          })
          .eq("id", existingReferral.id);

        if (updateError) {
          console.log("Profile referral update error:", updateError);
          return false;
        }
      } else {
        const { error: insertError } = await supabase
          .from("referred_clients")
          .insert([
            {
              name: referral.name,
              phone: referral.phone,
              source_client_id: String(clientId),
              source_client_name: sourceName,
              source_client_phone: sourcePhone,
              source_referral_id: referral.id,
            },
          ]);

        if (insertError) {
          console.log("Profile referral insert error:", insertError);
          return false;
        }
      }
    }

    return true;
  };

  const openClientProfile = async (client) => {
  setSelectedClientId(client.id);

  const { data: fullClient, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", client.id)
    .single();

  if (error) {
    console.log("Full client load error:", error);
    return;
  }

  setProfileNotes(fullClient?.notes || "");
  setProfileBlacklist(fullClient?.blacklist || false);
  setProfileFrame(fullClient?.frame || false);

  const sharedReferrals = await getSharedReferralsForClient(client.id);

  setProfileReferrals(
    sharedReferrals.length > 0
      ? sharedReferrals
      : Array.isArray(fullClient?.referrals)
      ? fullClient.referrals
      : []
  );

  setScreen("clientProfile");
};

  // 💾 SAVE CLIENT PROFILE
  const saveClientProfile = async () => {
    const updatedReferrals = profileReferrals.filter(
      (referral) => referral.name || referral.phone
    );

    const profileUpdate = {
      notes: profileNotes,
      blacklist: profileBlacklist,
      frame: profileFrame,
      referrals: updatedReferrals,
    };

    const { error } = await supabase
      .from("clients")
      .update(profileUpdate)
      .eq("id", selectedClientId);

    if (error) {
      console.log("Client profile save error:", error);

      const { error: fallbackError } = await supabase
        .from("clients")
        .update({
          notes: profileNotes,
          blacklist: profileBlacklist,
          frame: profileFrame,
        })
        .eq("id", selectedClientId);

      if (fallbackError) {
        console.log("Client profile fallback save error:", fallbackError);
        alert("لم يتم حفظ البروفايل. تأكد من اتصال الإنترنت وجرب مرة ثانية.");
        return;
      }
    }

    const referralsSaved = await syncProfileReferralsToSharedList(
      selectedClientId,
      updatedReferrals
    );

    if (!referralsSaved) {
      alert("تم حفظ البروفايل، لكن لم يتم نقل العملاء المرشحين. تأكد أن جدول referred_clients موجود في Supabase.");
      return;
    }

    setClients((prev) =>
      prev.map((client) =>
        String(client.id) === String(selectedClientId)
          ? { ...client, ...profileUpdate }
          : client
      )
    );
    fetchManualReferrals();
    setScreen("clients");
  };

  // ➕ ADD CLIENT REFERRAL
  const addProfileReferral = () => {
    setProfileReferrals((prev) => [
      {
        id: Date.now(),
        name: "",
        phone: "",
      },
      ...prev,
    ]);
  };

  // ✏️ UPDATE CLIENT REFERRAL
  const updateProfileReferral = (referralId, field, value) => {
    setProfileReferrals((prev) =>
      prev.map((referral) =>
        referral.id === referralId
          ? {
              ...referral,
              [field]: value,
            }
          : referral
      )
    );
  };

  // ❌ REMOVE CLIENT REFERRAL
  const removeProfileReferral = (referralId) => {
    setProfileReferrals((prev) =>
      prev.filter((referral) => referral.id !== referralId)
    );
  };

 const addVisit = async (id) => {
  const client = clients.find((c) => c.id === id);
  if (!client) return;

  const newVisits = (client.visits || 0) + 1;

  const { data: updatedClient, error } = await supabase
    .from("clients")
    .update({ visits: newVisits })
    .eq("id", id)
    .select("id,name,arabic_name,phone,address,visits,frame,blacklist")
    .single();

  if (error) {
    console.log(error);
  } else if (updatedClient) {
    const nextClient = normalizeClientRecord(updatedClient);
    setClients((prev) =>
      prev.map((clientItem) => String(clientItem.id) === String(nextClient.id) ? nextClient : clientItem)
    );
  }
};

 const removeVisit = async (id) => {
  const client = clients.find((c) => c.id === id);
  if (!client || client.visits <= 0) return;

  const newVisits = client.visits - 1;

  const { data: updatedClient, error } = await supabase
    .from("clients")
    .update({ visits: newVisits })
    .eq("id", id)
    .select("id,name,arabic_name,phone,address,visits,frame,blacklist")
    .single();

  if (error) {
    console.log(error);
  } else if (updatedClient) {
    const nextClient = normalizeClientRecord(updatedClient);
    setClients((prev) =>
      prev.map((clientItem) => String(clientItem.id) === String(nextClient.id) ? nextClient : clientItem)
    );
  }
};

  // 🖼️ UPDATE CLIENT FRAME
  const updateClientFrame = async (id, frameValue) => {
    setClients((prev) =>
      prev.map((client) =>
        client.id === id ? { ...client, frame: frameValue } : client
      )
    );

    const { data: updatedClient, error } = await supabase
      .from("clients")
      .update({ frame: frameValue })
      .eq("id", id)
      .select("id,name,arabic_name,phone,address,visits,frame,blacklist")
      .single();

    if (error) {
      console.log(error);
      setClients((prev) =>
        prev.map((client) =>
          client.id === id ? { ...client, frame: !frameValue } : client
        )
      );
      return;
    }

    if (updatedClient) {
      const nextClient = normalizeClientRecord(updatedClient);
      setClients((prev) =>
        prev.map((client) => String(client.id) === String(nextClient.id) ? nextClient : client)
      );
    }
  };

  // 📊 EXPORT CLIENTS TO EXCEL
  const exportClientsToExcel = () => {
    const rows = [
      ["الاسم", "رقم الجوال", "الحي", "عدد الخدمات"],
      ...clients.map((c) => [
        c.name,
        c.phone,
        c.address || "",
        c.visits,
      ]),
    ];

    const csvContent = rows
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Paradise-Clients.csv";
    link.click();
  };


  // 📅 SCHEDULE OPTIONS
  const appointmentStatuses = [
    "",
    "Gift Giver",
    "Gift Done",
    "Not Sure",
    "Therapist OFF",
    "Cancel",
    "Postponed",
  ];

  const sendToOptions = [
    "",
    "عملائنا",
    "عملاء الإهداء",
    "عملاء مرشحين",
    "عملاء محتملين",
  ];

  const statusColors = {
    "Gift Giver": "#e6b8df",
    "Gift Done": "#b7e4f2",
    "Not Sure": "#d8c5b3",
    "Therapist OFF": "#cfcfcf",
    Cancel: "#f4a6a6",
    Postponed: "#fff1a8",
  };

  const clientByOptions = ["Fatima", "Tahani", "Paradise F", "Paradise T"];
  const therapistOptions = ["Jocelyn", "Caren"];
  const orderOptions = ["", "1", "2", "3", "4", "Free", "5", "6", "7", "8", "9", "2 Free"];
  const paymentOptions = ["", "Cash", "Debit", "Credit", "Paid", "Bank Transfer"];
  const serviceOptions = [
    "",
    "Massage Relaxing 60 Mins",
    "Massage Hot Stone 60 Mins",
    "Mani/Pedi",
    "Massage Relaxing 60 Mins + Mani/Pedi",
    "Massage Hot Stone 60 Mins + Mani/Pedi",
  ];

  const timeSlots = Array.from({ length: 24 }, (_, index) => {
    const startMinutes = 13 * 60 + index * 30;
    const endMinutes = startMinutes + 30;

    const formatTime = (totalMinutes) => {
      const normalizedMinutes = totalMinutes % (24 * 60);
      let hour = Math.floor(normalizedMinutes / 60);
      const minute = normalizedMinutes % 60;
      if (hour === 0) hour = 12;
      if (hour > 12) hour = hour - 12;
      return `${hour}:${String(minute).padStart(2, "0")}`;
    };

    return `${formatTime(startMinutes)} - ${formatTime(endMinutes)}`;
  });

  const createEmptyAppointmentRow = (serviceTime) => ({
    clientBy: "",
    serviceTime,
    driver: "",
    therapist: "",
    district: "",
    client: "",
    frame: false,
    order: "",
    services: "",
    number: "",
    transportation: "",
    serviceAmount: "",
    paymentMethod: "",
    cashReceivedBy: "",
    status: "",
    sendTo: "",
    note: "",
    giftFrom: "",
    giftPhone: "",
  });

  const getRowsForDate = (date) => {
    return scheduleData[date]?.rows || timeSlots.map(createEmptyAppointmentRow);
  };

  const getScheduleRowId = (date, rowIndex) => `${date}-${rowIndex}`;

  const getScheduleRowCellStyles = (cellStyles, rowIndex) => {
    const rowStyles = {};

    Object.entries(cellStyles || {}).forEach(([cellKey, styleValue]) => {
      if (String(cellKey).startsWith(`${rowIndex}-`)) {
        rowStyles[cellKey] = styleValue;
      }
    });

    return rowStyles;
  };

  const applyScheduleRowsSnapshot = (date, dbRows) => {
    const rows = timeSlots.map(createEmptyAppointmentRow);
    const cellStyles = {};

    (dbRows || []).forEach((dbRow) => {
      const rowIndex = Number(dbRow.row_index);
      if (!Number.isInteger(rowIndex) || rowIndex < 0 || rowIndex >= rows.length) return;

      rows[rowIndex] = {
        ...rows[rowIndex],
        ...(dbRow.row_data || {}),
      };

      Object.assign(cellStyles, dbRow.cell_styles || {});
    });

    setScheduleData((prev) => ({
      ...prev,
      [date]: {
        ...(prev[date] || {}),
        rows,
        cellStyles,
      },
    }));
  };

  const loadScheduleRowsForDate = async (date = selectedScheduleDate) => {
    if (!date) return;

    const { data, error } = await supabase
      .from("schedule_rows")
      .select("id, schedule_date, row_index, row_data, cell_styles, updated_at, updated_by")
      .eq("schedule_date", date)
      .order("row_index", { ascending: true });

    if (error) {
      console.log("Schedule rows load error:", error);
      return;
    }

    applyScheduleRowsSnapshot(date, data || []);
  };
const getMonthStartDate = (monthKey) => `${monthKey}-01`;

const getMonthEndDate = (monthKey) => {
  const [year, month] = String(monthKey || "").split("-").map(Number);
  if (!year || !month) return `${monthKey}-31`;

  return new Date(year, month, 0).toISOString().slice(0, 10);
};

const loadIncomeExpenseReportDataRange = async (fromMonth, toMonth) => {
  if (!fromMonth || !toMonth) return;

  const rangeKey = `${fromMonth}_${toMonth}`;

  if (incomeExpenseLoadedRangesRef.current[rangeKey]) return;

  const fromDate = getMonthStartDate(fromMonth);
  const toDate = getMonthEndDate(toMonth);

  const pageSize = 1000;
let scheduleRows = [];
let fromIndex = 0;
let hasMoreScheduleRows = true;

while (hasMoreScheduleRows) {
  const toIndex = fromIndex + pageSize - 1;

  const { data: schedulePage, error: scheduleError } = await supabase
    .from("schedule_rows")
    .select("id, schedule_date, row_index, row_data, cell_styles, updated_at, updated_by")
    .gte("schedule_date", fromDate)
    .lte("schedule_date", toDate)
    .order("schedule_date", { ascending: true })
    .order("row_index", { ascending: true })
    .range(fromIndex, toIndex);

  if (scheduleError) {
    console.log("Income expense schedule rows load error:", scheduleError);
    return;
  }

  scheduleRows = [...scheduleRows, ...(schedulePage || [])];
  hasMoreScheduleRows = Array.isArray(schedulePage) && schedulePage.length === pageSize;
  fromIndex += pageSize;
}

  const rowsByDate = {};

  (scheduleRows || []).forEach((dbRow) => {
    const date = dbRow.schedule_date;
    const rowIndex = Number(dbRow.row_index);

    if (!date || !Number.isInteger(rowIndex)) return;

    if (!rowsByDate[date]) {
      rowsByDate[date] = {
        rows: timeSlots.map(createEmptyAppointmentRow),
        cellStyles: {},
      };
    }

    rowsByDate[date].rows[rowIndex] = {
      ...rowsByDate[date].rows[rowIndex],
      ...(dbRow.row_data || {}),
    };

    Object.assign(rowsByDate[date].cellStyles, dbRow.cell_styles || {});
  });

  setScheduleData((prev) => {
    const next = { ...prev };

    Object.entries(rowsByDate).forEach(([date, dayData]) => {
      next[date] = {
        ...(next[date] || {}),
        rows: dayData.rows,
        cellStyles: {
          ...((next[date] || {}).cellStyles || {}),
          ...dayData.cellStyles,
        },
      };
    });

    return next;
  });

  const { data: dailyReports, error: reportsError } = await supabase
    .from("daily_reports")
    .select("report_date, report_data, updated_at, updated_by")
    .gte("report_date", fromDate)
    .lte("report_date", toDate);

  if (reportsError) {
    console.log("Income expense daily reports load error:", reportsError);
    return;
  }

  setDailyManualData((prev) => {
    const next = { ...prev };

    (dailyReports || []).forEach((report) => {
      if (report.report_date) {
        next[report.report_date] = report.report_data || {};
      }
    });

    return next;
  });

  incomeExpenseLoadedRangesRef.current[rangeKey] = true;
};
  const applyScheduleRowFromRemote = (record) => {
    if (!record?.schedule_date && !record?.id) return;
    if (record?.updated_by === sharedDataDeviceIdRef.current) return;

    const date = record.schedule_date || String(record.id || "").split("-").slice(0, 3).join("-");
    const rowIndex = Number(record.row_index);

    if (!date || !Number.isInteger(rowIndex)) return;

    if (typeof document !== "undefined") {
      const activeElement = document.activeElement;
      const activeTag = activeElement?.tagName;
      const activeCell = activeElement?.getAttribute?.("data-schedule-cell") || "";
      const activeRowIndex = Number(String(activeCell).split("-")[0]);

      if (
        ["INPUT", "SELECT", "TEXTAREA"].includes(activeTag) &&
        date === selectedScheduleDate &&
        Number.isInteger(activeRowIndex) &&
        activeRowIndex === rowIndex
      ) {
        return;
      }
    }

    setScheduleData((prev) => {
      const dayData = prev[date] || {};
      const rowsForDate = dayData.rows || timeSlots.map(createEmptyAppointmentRow);
      const rows = rowsForDate.map((row, index) =>
        index === rowIndex
          ? {
              ...createEmptyAppointmentRow(timeSlots[rowIndex] || ""),
              ...row,
              ...(record.row_data || {}),
            }
          : row
      );

      return {
        ...prev,
        [date]: {
          ...dayData,
          rows,
          cellStyles: {
            ...(dayData.cellStyles || {}),
            ...(record.cell_styles || {}),
          },
        },
      };
    });
  };

  const deleteScheduleRowFromLocal = (record) => {
    const date = record?.schedule_date;
    const rowIndex = Number(record?.row_index);

    if (!date || !Number.isInteger(rowIndex)) return;

    setScheduleData((prev) => {
      const dayData = prev[date] || {};
      const rowsForDate = dayData.rows || timeSlots.map(createEmptyAppointmentRow);
      const rows = rowsForDate.map((row, index) =>
        index === rowIndex ? createEmptyAppointmentRow(timeSlots[rowIndex] || "") : row
      );
      const cellStyles = { ...(dayData.cellStyles || {}) };

      Object.keys(cellStyles).forEach((cellKey) => {
        if (String(cellKey).startsWith(`${rowIndex}-`)) {
          delete cellStyles[cellKey];
        }
      });

      return {
        ...prev,
        [date]: {
          ...dayData,
          rows,
          cellStyles,
        },
      };
    });
  };

  const saveScheduleRowToSupabase = async (date, rowIndex, rowData, cellStyles = {}) => {
    if (!date || !Number.isInteger(Number(rowIndex))) return;

    const numericRowIndex = Number(rowIndex);

    const { error } = await supabase.from("schedule_rows").upsert(
      {
        id: getScheduleRowId(date, numericRowIndex),
        schedule_date: date,
        row_index: numericRowIndex,
        row_data: rowData || createEmptyAppointmentRow(timeSlots[numericRowIndex] || ""),
        cell_styles: getScheduleRowCellStyles(cellStyles, numericRowIndex),
        updated_at: new Date().toISOString(),
        updated_by: sharedDataDeviceIdRef.current,
      },
      { onConflict: "id" }
    );

    if (error) {
      console.error(
  "Schedule row save error JSON:",
  JSON.stringify(error, null, 2)
);
    }
  };

  const queueScheduleRowSave = (date, rowIndex, rowData, cellStyles = {}) => {
    const rowId = getScheduleRowId(date, rowIndex);

    if (scheduleRowSaveTimersRef.current[rowId]) {
      clearTimeout(scheduleRowSaveTimersRef.current[rowId]);
    }

    scheduleRowSaveTimersRef.current[rowId] = setTimeout(() => {
      saveScheduleRowToSupabase(date, rowIndex, rowData, cellStyles);
      delete scheduleRowSaveTimersRef.current[rowId];
    }, 3000);
  };

  const persistScheduleRowsForDate = (date, rows, cellStyles, rowIndexes) => {
    (rowIndexes || []).forEach((rowIndex) => {
      queueScheduleRowSave(date, rowIndex, rows[rowIndex], cellStyles);
    });
  };

  useEffect(() => {
    if (!isLoggedIn || !selectedScheduleDate) return undefined;

    loadScheduleRowsForDate(selectedScheduleDate);

    const scheduleRowsChannel = supabase
      .channel("schedule-rows-sync")
      .on(
        "postgres_changes",
        {
  event: "*",
  schema: "public",
  table: "schedule_rows",
  
},
        (payload) => {
          if (payload.eventType === "DELETE") {
            deleteScheduleRowFromLocal(payload.old);
            return;
          }

          applyScheduleRowFromRemote(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(scheduleRowsChannel);
    };
  }, [isLoggedIn, selectedScheduleDate]);

  const financeDefaultMonthlySettings = {
    monthlyTarget: "30000",
    staffSalary: "13500",
    houseRent: "2000",
    carRent: "1335",
    governmentFees: "600",
  };

  const fixedMonthlyExpenseFields = [
    "staffSalary",
    "houseRent",
    "carRent",
    "governmentFees",
  ];

  const getMonthKeyFromDate = (dateString) => String(dateString || "").slice(0, 7);

  const getMonthDaysCount = (monthKey) => {
    const [year, month] = String(monthKey || currentDate.slice(0, 7))
      .split("-")
      .map(Number);

    return new Date(year, month, 0).getDate();
  };

  const getFinanceMonthSettings = (monthKey) => {
    const directSettings = financeMonthlySettings[monthKey];

    if (directSettings) {
      return {
        ...financeDefaultMonthlySettings,
        ...directSettings,
      };
    }

    const previousMonthKey = Object.keys(financeMonthlySettings)
      .filter((key) => key < monthKey)
      .sort()
      .pop();

    return {
      ...financeDefaultMonthlySettings,
      ...(previousMonthKey ? financeMonthlySettings[previousMonthKey] : {}),
    };
  };

  const getDistributedFixedExpensesForDate = (dateString) => {
    const monthKey = getMonthKeyFromDate(dateString);
    const settings = getFinanceMonthSettings(monthKey);
    const daysCount = getMonthDaysCount(monthKey) || 30;

    return fixedMonthlyExpenseFields.reduce((result, field) => {
      result[field] = Number((parseAmount(settings[field]) / daysCount).toFixed(2));
      return result;
    }, {});
  };

  const getManualForDate = (date) => {
    const savedManual = dailyManualData[date] || {};
    const distributedFixedExpenses = getDistributedFixedExpensesForDate(date);
    const baseManual = {
      clientsTurnedAway: "",
      naft: "",
      uber: "",
      purchase: "",
      staffSalary: distributedFixedExpenses.staffSalary,
      houseRent: distributedFixedExpenses.houseRent,
      carRent: distributedFixedExpenses.carRent,
      governmentFees: distributedFixedExpenses.governmentFees,
      commissionJoce: "",
      commissionCaren: "",
      serviceMassage: "",
      serviceManiPedi: "",
      serviceMoroccanBath: "",
      servicePackage: "",
    };

    return {
      ...baseManual,
      ...savedManual,
      staffSalary: baseManual.staffSalary,
      houseRent: baseManual.houseRent,
      carRent: baseManual.carRent,
      governmentFees: baseManual.governmentFees,
    };
  };

  

    const updateManualForDate = (field, value) => {
  dailyManualLastEditRef.current = Date.now();

  setDailyManualData((prev) => {
    const nextReport = {
      ...(prev[selectedScheduleDate] || getManualForDate(selectedScheduleDate)),
      [field]: value,
    };

    queueDailyReportSave(selectedScheduleDate, nextReport);

    return {
      ...prev,
      [selectedScheduleDate]: nextReport,
    };
  });
};
  

  const updateManualForSpecificDate = (date, field, value) => {
  dailyManualLastEditRef.current = Date.now();

  setDailyManualData((prev) => {
    const nextReport = {
      ...(prev[date] || getManualForDate(date)),
      [field]: value,
    };

    queueDailyReportSave(date, nextReport);

    return {
      ...prev,
      [date]: nextReport,
    };
  });
};

  const parseAmount = (value) => {
    const rawValue = String(value ?? "").replace(/,/g, "");
    const matchedValue = rawValue.match(/-?\d+(\.\d+)?/);
    const number = matchedValue ? Number(matchedValue[0]) : 0;
    return Number.isFinite(number) ? number : 0;
  };

  const normalizePhone = (phoneNumber) => {
    return String(phoneNumber || "").replace(/\D/g, "");
  };

  const findClientByExactPhone = (phoneNumber) => {
    const normalizedPhone = normalizePhone(phoneNumber);

    if (normalizedPhone.length < 9) return null;

    return clients.find(
      (client) =>
        normalizePhone(client.phone) === normalizedPhone ||
        normalizePhone(formatSaudiPhoneForStorage(client.phone)) === normalizedPhone ||
        normalizePhone(client.phone) === normalizePhone(formatSaudiPhoneForStorage(phoneNumber))
    );
  };

  const orderToVisits = (order) => {
    if (order === "Free") return 5;
    if (order === "2 Free") return 11;
    const parsed = Number(order);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
  };

  const scheduleColumns = [
    { field: "status", label: "Status", width: 96 },
    { field: "clientBy", label: "Client By", width: 92 },
    { field: "serviceTime", label: "Service Time", width: 88 },
    { field: "driver", label: "Driver", width: 80 },
    { field: "therapist", label: "Therapist", width: 84 },
    { field: "district", label: "District", width: 92 },
    { field: "client", label: "Client", width: 94 },
    { field: "frame", label: "Frame", width: 52 },
    { field: "order", label: "Orders", width: 58 },
    { field: "services", label: "Services", width: 120 },
    { field: "number", label: "Number", width: 96 },
    { field: "transportation", label: "Transportation", width: 92 },
    { field: "serviceAmount", label: "Service Amount", width: 92 },
    { field: "totalPrice", label: "Total Price", width: 78, readOnly: true },
    { field: "paymentMethod", label: "Payment Method", width: 102 },
    { field: "cashReceivedBy", label: "Cash Received By", width: 102 },
    { field: "sendTo", label: "Send To", width: 120 },
    { field: "note", label: "Note", width: 160 },
    { field: "giftFrom", label: "Gift From", width: 112 },
    { field: "giftPhone", label: "Phone No.", width: 106 },
  ];

  const scheduleSelectableFields = scheduleColumns
    .filter((column) => !column.readOnly)
    .map((column) => column.field);

  const scheduleFillColors = [
    ["", "بدون لون"],
    ["#fffaf3", "كريمي"],
    ["#f2e7da", "بيج"],
    ["#d9ebf7", "أزرق فاتح"],
    ["#e8f3df", "أخضر فاتح"],
    ["#fff1a8", "أصفر"],
    ["#f4c7c3", "وردي"],
    ["#ead8c9", "بني فاتح"],
  ];

  const scheduleFontSizes = ["12", "13", "14", "15", "16", "18"];

  const getScheduleColumnWidth = (field) => {
    const savedWidth = scheduleSettings?.columnWidths?.[field];
    const defaultWidth =
      scheduleColumns.find((column) => column.field === field)?.width || 90;

    return Number(savedWidth || defaultWidth);
  };

  const getScheduleCellKey = (rowIndex, field) => `${rowIndex}-${field}`;

  const getScheduleCellSavedStyle = (rowIndex, field) => {
    const currentDayData = scheduleData[selectedScheduleDate] || {};
    return currentDayData.cellStyles?.[getScheduleCellKey(rowIndex, field)] || {};
  };

  const getScheduleFieldIndex = (field) =>
    scheduleSelectableFields.indexOf(field);

  const getScheduleSelectionBounds = () => {
    if (!scheduleSelection) return null;

    const startFieldIndex = getScheduleFieldIndex(scheduleSelection.startField);
    const endFieldIndex = getScheduleFieldIndex(scheduleSelection.endField);

    if (startFieldIndex === -1 || endFieldIndex === -1) return null;

    return {
      minRow: Math.min(scheduleSelection.startRow, scheduleSelection.endRow),
      maxRow: Math.max(scheduleSelection.startRow, scheduleSelection.endRow),
      minField: Math.min(startFieldIndex, endFieldIndex),
      maxField: Math.max(startFieldIndex, endFieldIndex),
    };
  };

  const getScheduleSelectionCellCount = () => {
    const bounds = getScheduleSelectionBounds();
    if (!bounds) return 0;

    return (
      (bounds.maxRow - bounds.minRow + 1) *
      (bounds.maxField - bounds.minField + 1)
    );
  };

  const isScheduleCellSelected = (rowIndex, field) => {
    const bounds = getScheduleSelectionBounds();
    const fieldIndex = getScheduleFieldIndex(field);

    if (!bounds || fieldIndex === -1) return false;

    return (
      rowIndex >= bounds.minRow &&
      rowIndex <= bounds.maxRow &&
      fieldIndex >= bounds.minField &&
      fieldIndex <= bounds.maxField
    );
  };

  const focusScheduleCell = (rowIndex, field) => {
    const target = document.querySelector(
      `[data-schedule-cell="${rowIndex}-${field}"]`
    );

    if (target) {
      target.focus();
      if (typeof target.select === "function") {
        setTimeout(() => target.select(), 0);
      }
    }
  };

  const moveScheduleActiveCell = (rowIndex, field, shiftPressed = false) => {
    const safeRow = Math.max(0, Math.min(timeSlots.length - 1, rowIndex));
    const safeField =
      scheduleSelectableFields.includes(field) ? field : scheduleSelectableFields[0];

    if (shiftPressed && scheduleSelection) {
      setScheduleSelection((previousSelection) => ({
        ...(previousSelection || {
          startRow: scheduleActiveCell?.row ?? safeRow,
          startField: scheduleActiveCell?.field ?? safeField,
        }),
        endRow: safeRow,
        endField: safeField,
      }));
    } else {
      setScheduleSelection({
        startRow: safeRow,
        endRow: safeRow,
        startField: safeField,
        endField: safeField,
      });
    }

    setScheduleActiveCell({ row: safeRow, field: safeField });
    focusScheduleCell(safeRow, safeField);
  };

  const handleScheduleCellKeyDown = (event, rowIndex, field) => {
    const fieldIndex = getScheduleFieldIndex(field);
    if (fieldIndex === -1) return;

    let nextRow = rowIndex;
    let nextFieldIndex = fieldIndex;
    let shouldMove = false;

    if (event.key === "ArrowDown" || event.key === "Enter") {
      nextRow += 1;
      shouldMove = true;
    } else if (event.key === "ArrowUp") {
      nextRow -= 1;
      shouldMove = true;
    } else if (event.key === "ArrowRight") {
      nextFieldIndex += 1;
      shouldMove = true;
    } else if (event.key === "ArrowLeft") {
      nextFieldIndex -= 1;
      shouldMove = true;
    }

    if (!shouldMove) return;

    event.preventDefault();

    const nextField =
      scheduleSelectableFields[
        Math.max(0, Math.min(scheduleSelectableFields.length - 1, nextFieldIndex))
      ];

    moveScheduleActiveCell(nextRow, nextField, event.shiftKey);
  };

  const startScheduleSelection = (rowIndex, field) => {
    scheduleSelectingRef.current = true;
    setScheduleActiveCell({ row: rowIndex, field });
    setScheduleSelection({
      startRow: rowIndex,
      endRow: rowIndex,
      startField: field,
      endField: field,
    });
  };

  const extendScheduleSelection = (rowIndex, field) => {
    if (!scheduleSelectingRef.current) return;

    setScheduleSelection((previousSelection) => {
      if (!previousSelection) {
        return {
          startRow: rowIndex,
          endRow: rowIndex,
          startField: field,
          endField: field,
        };
      }

      return {
        ...previousSelection,
        endRow: rowIndex,
        endField: field,
      };
    });
  };

  const finishScheduleSelection = () => {
    scheduleSelectingRef.current = false;
  };

  const getScheduleCellStyle = (rowIndex, field, extraStyle = {}) => {
    const savedStyle = getScheduleCellSavedStyle(rowIndex, field);
    const selectedStyle = isScheduleCellSelected(rowIndex, field)
      ? {
          outline: "2px solid #4b2e1f",
          outlineOffset: "-2px",
          boxShadow: "inset 0 0 0 999px rgba(75,46,31,0.08)",
        }
      : {};

    return {
      ...scheduleDataCellStyle,
      width: `${getScheduleColumnWidth(field)}px`,
      minWidth: `${getScheduleColumnWidth(field)}px`,
      maxWidth: `${getScheduleColumnWidth(field)}px`,
      backgroundColor: savedStyle.fillColor || "transparent",
      fontSize: `${savedStyle.fontSize || scheduleSettings.defaultFontSize || 14}px`,
      ...selectedStyle,
      ...extraStyle,
    };
  };

  const getScheduleInputStyle = (rowIndex, field, extraStyle = {}) => {
    const savedStyle = getScheduleCellSavedStyle(rowIndex, field);

    return {
      ...scheduleInputStyle,
      width: "100%",
      fontSize: `${savedStyle.fontSize || scheduleSettings.defaultFontSize || 14}px`,
      ...extraStyle,
    };
  };

  const getScheduleEditableProps = (rowIndex, field) => ({
    "data-schedule-cell": `${rowIndex}-${field}`,
    onFocus: () => {
      scheduleLastEditRef.current = Date.now();
      moveScheduleActiveCell(rowIndex, field);
    },
    onKeyDown: (event) => handleScheduleCellKeyDown(event, rowIndex, field),
  });

  const getScheduleCellHandlers = (rowIndex, field) => ({
    onMouseDown: () => startScheduleSelection(rowIndex, field),
    onMouseEnter: () => extendScheduleSelection(rowIndex, field),
    onMouseUp: finishScheduleSelection,
  });

  const applyScheduleCellFormatting = (formatKey, formatValue) => {
    const bounds = getScheduleSelectionBounds();
    if (!bounds) return;

    scheduleLastEditRef.current = Date.now();

    const changedRowIndexes = [];
    let nextRowsSnapshot = [];
    let nextStylesSnapshot = {};

    setScheduleData((prev) => {
      const currentDayData = prev[selectedScheduleDate] || {};
      const previousStyles = currentDayData.cellStyles || {};
      const nextStyles = { ...previousStyles };

      for (let rowIndex = bounds.minRow; rowIndex <= bounds.maxRow; rowIndex += 1) {
        changedRowIndexes.push(rowIndex);

        scheduleSelectableFields.forEach((field, fieldIndex) => {
          if (fieldIndex < bounds.minField || fieldIndex > bounds.maxField) return;

          const cellKey = getScheduleCellKey(rowIndex, field);
          const currentStyle = nextStyles[cellKey] || {};

          if (!formatValue) {
            const restStyle = { ...currentStyle };
            delete restStyle[formatKey];
            nextStyles[cellKey] = restStyle;
          } else {
            nextStyles[cellKey] = {
              ...currentStyle,
              [formatKey]: formatValue,
            };
          }

          if (Object.keys(nextStyles[cellKey]).length === 0) {
            delete nextStyles[cellKey];
          }
        });
      }

      nextRowsSnapshot = currentDayData.rows || timeSlots.map(createEmptyAppointmentRow);
      nextStylesSnapshot = nextStyles;

      return {
        ...prev,
        [selectedScheduleDate]: {
          ...currentDayData,
          cellStyles: nextStyles,
        },
      };
    });

    setTimeout(() => {
      persistScheduleRowsForDate(
        selectedScheduleDate,
        nextRowsSnapshot,
        nextStylesSnapshot,
        changedRowIndexes
      );
    }, 0);
  };

  const updateScheduleDefaultFontSize = (fontSize) => {
    scheduleSettingsLastEditRef.current = Date.now();

    setScheduleSettings((prev) => ({
      ...prev,
      defaultFontSize: fontSize,
    }));

    applyScheduleCellFormatting("fontSize", fontSize);
  };

  const startScheduleColumnResize = (event, field) => {
    event.preventDefault();
    event.stopPropagation();

    scheduleResizeRef.current = {
      field,
      startX: event.clientX,
      startWidth: getScheduleColumnWidth(field),
    };
  };

  const resizeScheduleColumn = (event) => {
    const resizeState = scheduleResizeRef.current;
    if (!resizeState) return;

    const nextWidth = Math.max(
      44,
      Math.min(360, resizeState.startWidth + event.clientX - resizeState.startX)
    );

    scheduleSettingsLastEditRef.current = Date.now();

    setScheduleSettings((prev) => ({
      ...prev,
      columnWidths: {
        ...(prev.columnWidths || {}),
        [resizeState.field]: nextWidth,
      },
    }));
  };

  const finishScheduleColumnResize = () => {
    scheduleResizeRef.current = null;
  };

  const clearSelectedScheduleCells = () => {
    const bounds = getScheduleSelectionBounds();
    if (!bounds) return;

    scheduleLastEditRef.current = Date.now();

    const changedRowIndexes = [];
    let nextRowsSnapshot = [];
    let nextStylesSnapshot = {};

    setScheduleData((prev) => {
      const currentDayData = prev[selectedScheduleDate] || {};
      const currentRows = currentDayData.rows || timeSlots.map(createEmptyAppointmentRow);

      const rows = currentRows.map((row, rowIndex) => {
        if (rowIndex < bounds.minRow || rowIndex > bounds.maxRow) return row;

        changedRowIndexes.push(rowIndex);
        const updatedRow = { ...row };

        scheduleSelectableFields.forEach((field, fieldIndex) => {
          if (fieldIndex < bounds.minField || fieldIndex > bounds.maxField) return;

          updatedRow[field] = field === "frame" ? false : "";
        });

        return updatedRow;
      });

      nextRowsSnapshot = rows;
      nextStylesSnapshot = currentDayData.cellStyles || {};

      return {
        ...prev,
        [selectedScheduleDate]: {
          ...currentDayData,
          rows,
        },
      };
    });

    setTimeout(() => {
      persistScheduleRowsForDate(
        selectedScheduleDate,
        nextRowsSnapshot,
        nextStylesSnapshot,
        changedRowIndexes
      );
    }, 0);
  };

  useEffect(() => {
    const stopSelection = () => {
      scheduleSelectingRef.current = false;
    };

    const handleScheduleDeleteKey = (event) => {
      if (event.key !== "Delete" && event.key !== "Backspace") return;
      if (!scheduleSelection || getScheduleSelectionCellCount() <= 0) return;

      const activeElement = document.activeElement;
const activeTag = activeElement?.tagName;
const activeScheduleCell =
  activeElement?.getAttribute?.("data-schedule-cell") || "";

if (
  ["INPUT", "SELECT", "TEXTAREA"].includes(activeTag) &&
  !activeScheduleCell
) {
  return;
}

const isEditingSingleInput =
  getScheduleSelectionCellCount() === 1 &&
  ["INPUT", "SELECT", "TEXTAREA"].includes(activeTag);

if (isEditingSingleInput) return;

      event.preventDefault();
      clearSelectedScheduleCells();
    };

    window.addEventListener("mouseup", stopSelection);
    window.addEventListener("mouseup", finishScheduleColumnResize);
    window.addEventListener("mousemove", resizeScheduleColumn);
    window.addEventListener("keydown", handleScheduleDeleteKey);

    return () => {
      window.removeEventListener("mouseup", stopSelection);
      window.removeEventListener("mouseup", finishScheduleColumnResize);
      window.removeEventListener("mousemove", resizeScheduleColumn);
      window.removeEventListener("keydown", handleScheduleDeleteKey);
    };
  }, [scheduleSelection, selectedScheduleDate, scheduleData, scheduleSettings]);

  const applyScheduleNumberLookup = (rowIndex, phoneValue) => {
    scheduleLastEditRef.current = Date.now();

    let rowToSave = null;
    let stylesToSave = {};

    setScheduleData((prev) => {
      const currentDayData = prev[selectedScheduleDate] || {};
      const currentRows = currentDayData.rows || timeSlots.map(createEmptyAppointmentRow);
      const rowToCheck = currentRows[rowIndex] || {};
      const numberToCheck = phoneValue ?? rowToCheck.number ?? "";
      const matchedClient = findClientByExactPhone(numberToCheck);

      if (!matchedClient) return prev;

      const rows = currentRows.map((row, index) => {
        if (index !== rowIndex) return row;

        rowToSave = {
          ...row,
          number: numberToCheck,
          client: matchedClient.name,
          district: matchedClient.address || "",
          frame: Boolean(matchedClient.frame),
          order: String(getVisitLabel(matchedClient.visits)),
        };

        return rowToSave;
      });

      stylesToSave = currentDayData.cellStyles || {};

      return {
        ...prev,
        [selectedScheduleDate]: {
          ...currentDayData,
          rows,
        },
      };
    });

    setTimeout(() => {
      if (rowToSave) {
        queueScheduleRowSave(selectedScheduleDate, rowIndex, rowToSave, stylesToSave);
      }
    }, 0);
  };

  const addScheduleGiftToGiftClients = async (row) => {
    const fromName = String(row.giftFrom || "").trim();
    const fromPhone = formatSaudiPhoneForStorage(row.giftPhone || "");
    const toName = String(row.client || "").trim();
    const toPhone = formatSaudiPhoneForStorage(row.number || "");
    const service = String(row.services || "").trim();

    if (!fromName && !fromPhone && !toName && !toPhone && !service) return;

    const giftRecord = {
      gift_date: selectedScheduleDate,
      from_name: fromName,
      from_phone: fromPhone,
      to_name: toName,
      to_phone: toPhone,
      service,
      items: {
        balloon: false,
        flowers: false,
        cake: false,
        giftTaken: false,
        giftDate: selectedScheduleDate,
      },
    };

    const { error } = await supabase.from("gift_clients").insert([giftRecord]);

    if (error) {
      const { error: fallbackError } = await supabase.from("gift_clients").insert([
        {
          from_name: fromName,
          from_phone: fromPhone,
          to_name: toName,
          to_phone: toPhone,
          service,
          items: {
            balloon: false,
            flowers: false,
            cake: false,
            giftTaken: false,
            giftDate: selectedScheduleDate,
          },
        },
      ]);

      if (fallbackError) {
        console.log("Gift Giver gift client insert error:", fallbackError);
        return;
      }
    }

    fetchGiftClients();
  };

  const copyScheduleRowToSelectedList = async (row, targetList) => {
    if (!targetList) return;

    const clientName = String(row.client || "").trim();
    const clientPhone = formatSaudiPhoneForStorage(row.number || "");
    const district = String(row.district || "").trim();
    const service = String(row.services || "").trim();
    const giftFromNameValue = String(row.giftFrom || "").trim();
    const giftFromPhoneValue = formatSaudiPhoneForStorage(row.giftPhone || "");

    if (
      !clientName &&
      !clientPhone &&
      !district &&
      !service &&
      !giftFromNameValue &&
      !giftFromPhoneValue
    ) {
      return;
    }

    if (targetList === "عملائنا") {
      const { data: insertedClient, error } = await supabase.from("clients").insert([
        {
          name: clientName,
          arabic_name: clientName,
          phone: clientPhone,
          address: district,
          visits: 0,
          frame: Boolean(row.frame),
          blacklist: false,
          notes: service,
          total_paid: 0,
          service_history: [],
        },
      ]).select("id,name,arabic_name,phone,address,visits,frame,blacklist").single();

      if (error) {
        console.log("Send To clients copy error:", error);
        return;
      }

      if (insertedClient) {
        const nextClient = normalizeClientRecord(insertedClient);
        setClients((prev) => {
          const exists = prev.some((client) => String(client.id) === String(nextClient.id));
          const nextClients = exists
            ? prev.map((client) => String(client.id) === String(nextClient.id) ? nextClient : client)
            : [nextClient, ...prev];

          return nextClients.sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
        });
      }
      return;
    }

    if (targetList === "عملاء الإهداء") {
      const giftRecord = {
        gift_date: selectedScheduleDate,
        from_name: giftFromNameValue,
        from_phone: giftFromPhoneValue,
        to_name: clientName,
        to_phone: clientPhone,
        service,
        items: {
          balloon: false,
          flowers: false,
          cake: false,
          giftTaken: false,
          giftDate: selectedScheduleDate,
        },
      };

      const { error } = await supabase.from("gift_clients").insert([giftRecord]);

      if (error) {
        const { error: fallbackError } = await supabase.from("gift_clients").insert([
          {
            from_name: giftFromNameValue,
            from_phone: giftFromPhoneValue,
            to_name: clientName,
            to_phone: clientPhone,
            service,
            items: {
              balloon: false,
              flowers: false,
              cake: false,
              giftTaken: false,
              giftDate: selectedScheduleDate,
            },
          },
        ]);

        if (fallbackError) {
          console.log("Send To gift clients copy error:", fallbackError);
          return;
        }
      }

      fetchGiftClients();
      return;
    }

    if (targetList === "عملاء مرشحين") {
      const { error } = await supabase.from("referred_clients").insert([
        {
          name: clientName,
          phone: clientPhone,
          source_client_name: giftFromNameValue,
          source_client_phone: giftFromPhoneValue,
        },
      ]);

      if (error) {
        console.log("Send To referred clients copy error:", error);
        return;
      }

      fetchManualReferrals();
      return;
    }

    if (targetList === "عملاء محتملين") {
      const { error } = await supabase.from("potential_clients").insert([
        {
          name: clientName,
          phone: clientPhone,
          status: row.status || "إلغاء موعد",
        },
      ]);

      if (error) {
        console.log("Send To potential clients copy error:", error);
        return;
      }

      fetchPotentialClients();
    }
  };

  const updateScheduleRow = async (rowIndex, field, value) => {
    scheduleLastEditRef.current = Date.now();

    const currentDayData = scheduleData[selectedScheduleDate] || {};
    const currentRows = currentDayData.rows || timeSlots.map(createEmptyAppointmentRow);
    const originalRow = currentRows[rowIndex] || createEmptyAppointmentRow(timeSlots[rowIndex] || "");
    const updatedRowSnapshot = {
      ...originalRow,
      [field]: value,
    };

    if (field === "serviceAmount" || field === "transportation") {
      updatedRowSnapshot.totalPrice =
        parseAmount(
          field === "serviceAmount" ? value : updatedRowSnapshot.serviceAmount
        ) +
        parseAmount(
          field === "transportation" ? value : updatedRowSnapshot.transportation
        );
    }

    let nextCellStyles = {};

    setScheduleData((prev) => {
      const dayData = prev[selectedScheduleDate] || {};
      const rowsForDate = dayData.rows || timeSlots.map(createEmptyAppointmentRow);

      const rows = rowsForDate.map((row, index) =>
        index === rowIndex ? updatedRowSnapshot : row
      );

      nextCellStyles = dayData.cellStyles || {};

      return {
        ...prev,
        [selectedScheduleDate]: {
          ...dayData,
          rows,
        },
      };
    });

    queueScheduleRowSave(selectedScheduleDate, rowIndex, updatedRowSnapshot, nextCellStyles);

    if (field === "order") {
      const matchedClientForOrder = findClientByExactPhone(
        updatedRowSnapshot?.number || ""
      );
      const visitsValue = orderToVisits(value);

      if (matchedClientForOrder && visitsValue !== null) {
        const { data: updatedClient, error } = await supabase
          .from("clients")
          .update({ visits: visitsValue })
          .eq("id", matchedClientForOrder.id)
          .select("id,name,arabic_name,phone,address,visits,frame,blacklist")
          .single();

        if (error) {
          console.log(error);
        } else if (updatedClient) {
          const nextClient = normalizeClientRecord(updatedClient);
          setClients((prev) =>
            prev.map((client) => String(client.id) === String(nextClient.id) ? nextClient : client)
          );
        }
      }
    }

    if (field === "sendTo" && value) {
      await copyScheduleRowToSelectedList(updatedRowSnapshot, value);
    }

    if (
      field === "status" &&
      value === "Gift Giver" &&
      originalRow.status !== "Gift Giver"
    ) {
      const latestDayData = scheduleData[selectedScheduleDate] || {};
      const latestRows = latestDayData.rows || timeSlots.map(createEmptyAppointmentRow);
      const latestRow = latestRows[rowIndex] || originalRow || {};
      const giftGiverRow = {
        ...latestRow,
        status: value,
      };

      await addScheduleGiftToGiftClients(giftGiverRow);
    }
  };

  const getAppointmentStats = () => {
    const rows = getRowsForDate(selectedScheduleDate);
    const manual = getManualForDate(selectedScheduleDate);

    const activeRows = rows.filter(
      (row) => row.client || row.number || row.services || row.serviceAmount
    );

    const totalIncome = rows.reduce(
      (sum, row) =>
        row.status === "Cancel"
          ? sum
          : sum + parseAmount(row.serviceAmount) + parseAmount(row.transportation),
      0
    );

    const totalTransportation = rows.reduce(
      (sum, row) =>
        row.status === "Cancel" ? sum : sum + parseAmount(row.transportation),
      0
    );

    const paymentTotals = {
      Cash: 0,
      Debit: 0,
      Credit: 0,
      "Bank Transfer": 0,
      Paid: 0,
    };

    rows.forEach((row) => {
      const amount = parseAmount(row.serviceAmount) + parseAmount(row.transportation);
      if (paymentTotals[row.paymentMethod] !== undefined && row.status !== "Cancel") {
        paymentTotals[row.paymentMethod] += amount;
      }
    });

    const servicesTotals = {
      Massage: parseAmount(manual.serviceMassage),
      "Mani & Pedi": parseAmount(manual.serviceManiPedi),
      "Moroccan Bath": parseAmount(manual.serviceMoroccanBath),
      Package: parseAmount(manual.servicePackage),
    };

    const totalServices = Object.values(servicesTotals).reduce(
      (sum, value) => sum + value,
      0
    );

    const newClients = rows.filter((row) => row.order === "1").length;
    const loyalClients = rows.filter(
      (row) => row.order && row.order !== "1"
    ).length;

    const giftsAdded = rows.filter((row) => row.status === "Gift Giver").length;
    const giftsReceived = rows.filter((row) => row.status === "Gift Done").length;
    const freeGifts = rows.filter((row) => row.order === "Free").length;
    const twoFreeGifts = rows.filter((row) => row.order === "2 Free").length;

    const totalCommission =
      parseAmount(manual.commissionJoce) +
      parseAmount(manual.commissionCaren);

    const dailyCost =
      parseAmount(manual.naft) +
      parseAmount(manual.uber) +
      parseAmount(manual.purchase) +
      parseAmount(manual.staffSalary) +
      parseAmount(manual.houseRent) +
      parseAmount(manual.carRent) +
      parseAmount(manual.governmentFees) +
      totalCommission;

    return {
      rows,
      manual,
      activeRows,
      totalIncome,
      totalTransportation,
      paymentTotals,
      servicesTotals,
      totalServices,
      newClients,
      loyalClients,
      giftsAdded,
      giftsReceived,
      freeGifts,
      twoFreeGifts,
      averageServicePrice: totalServices ? totalIncome / totalServices : 0,
      totalCommission,
      dailyCost,
      netProfit: totalIncome - dailyCost,
    };
  };

  const formatAppointmentDate = (dateString) => {
    const date = new Date(`${dateString}T12:00:00`);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAppointmentStartTime = (serviceTime) =>
    String(serviceTime || "").split("-")[0].trim();

  const addMinutesToDisplayTime = (timeValue, minutesToAdd) => {
    const timeText = getAppointmentStartTime(timeValue);
    const match = timeText.match(/^(\d{1,2}):(\d{2})$/);

    if (!match) return "-";

    let hours = Number(match[1]);
    const minutes = Number(match[2]);

    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return "-";

    if (hours < 12) {
      hours += 12;
    }

    const totalMinutes = hours * 60 + minutes + minutesToAdd;
    const normalizedMinutes = totalMinutes % (24 * 60);
    let displayHour = Math.floor(normalizedMinutes / 60);
    const displayMinute = normalizedMinutes % 60;

    if (displayHour === 0) displayHour = 12;
    if (displayHour > 12) displayHour -= 12;

    return `${displayHour}:${String(displayMinute).padStart(2, "0")}`;
  };

  const staffWhatsAppNumbers = {
    Joce: "0541901434",
    Caren: "0572954871",
  };

  const formatCurrency = (value) => String(Math.round(parseAmount(value)));

  const getFinanceMonthLabel = (monthKey) => {
    const date = new Date(`${monthKey}-01T12:00:00`);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const getFinanceMonthDates = (monthKey) => {
    const [year, month] = String(monthKey).split("-").map(Number);
    const daysCount = getMonthDaysCount(monthKey);

    return Array.from({ length: daysCount }, (_, index) => {
      const day = String(index + 1).padStart(2, "0");
      return `${year}-${String(month).padStart(2, "0")}-${day}`;
    });
  };

  const getAvailableFinanceMonths = () => {
    const months = new Set(["2026-05", currentDate.slice(0, 7)]);
    const start = new Date("2026-05-01T12:00:00");
    const current = new Date(`${currentDate.slice(0, 7)}-01T12:00:00`);

    for (
      let date = new Date(start);
      date <= current;
      date.setMonth(date.getMonth() + 1)
    ) {
      months.add(date.toISOString().slice(0, 7));
    }

    Object.keys(scheduleData || {}).forEach((dateKey) => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateKey) && dateKey >= "2026-05-01") {
        months.add(dateKey.slice(0, 7));
      }
    });

    Object.keys(financeMonthlySettings || {}).forEach((monthKey) => {
      if (/^\d{4}-\d{2}$/.test(monthKey) && monthKey >= "2026-05") {
        months.add(monthKey);
      }
    });

    return Array.from(months).sort();
  };

  const updateFinanceMonthlySetting = (monthKey, field, value) => {
    financeSettingsLastEditRef.current = Date.now();

    setFinanceMonthlySettings((prev) => ({
      ...prev,
      [monthKey]: {
        ...getFinanceMonthSettings(monthKey),
        ...(prev[monthKey] || {}),
        [field]: value,
      },
    }));
  };

  const getFinanceDayStats = (date, monthlySettings) => {
    const rows = getRowsForDate(date);
    const manual = getManualForDate(date);
    const daysCount = getMonthDaysCount(getMonthKeyFromDate(date));
    const fixedDailyExpenses = fixedMonthlyExpenseFields.reduce(
      (sum, field) => sum + parseAmount(monthlySettings[field]) / daysCount,
      0
    );

    const activeRows = rows.filter(
      (row) => row.status !== "Cancel" && (row.client || row.number || row.services || row.serviceAmount || row.transportation)
    );

    const income = activeRows.reduce(
      (sum, row) => sum + parseAmount(row.serviceAmount) + parseAmount(row.transportation),
      0
    );

    const transportation = activeRows.reduce(
      (sum, row) => sum + parseAmount(row.transportation),
      0
    );

    const paymentTotals = {
      Cash: 0,
      Debit: 0,
      Credit: 0,
      Tabby: 0,
      Tamara: 0,
      "Bank Transfer": 0,
      Paid: 0,
    };

    activeRows.forEach((row) => {
      const amount = parseAmount(row.serviceAmount) + parseAmount(row.transportation);
      const method = row.paymentMethod || "";

      if (paymentTotals[method] !== undefined) {
        paymentTotals[method] += amount;
      }
    });

    const variableExpenses =
      parseAmount(manual.naft) +
      parseAmount(manual.uber) +
      parseAmount(manual.purchase) +
      parseAmount(manual.commissionJoce) +
      parseAmount(manual.commissionCaren);

    const servicesTotals = {
      Massage: parseAmount(manual.serviceMassage),
      "Mani & Pedi": parseAmount(manual.serviceManiPedi),
      "Moroccan Bath": parseAmount(manual.serviceMoroccanBath),
      Package: parseAmount(manual.servicePackage),
    };

    const totalServices = Object.values(servicesTotals).reduce((sum, value) => sum + value, 0);
    const clientsTurnedAway = parseAmount(manual.clientsTurnedAway);

    return {
      date,
      rows,
      manual,
      activeRows,
      income,
      transportation,
      paymentTotals,
      variableExpenses,
      fixedDailyExpenses,
      expenses: variableExpenses + fixedDailyExpenses,
      netProfit: income - variableExpenses - fixedDailyExpenses,
      servicesTotals,
      totalServices,
      newClients: activeRows.filter((row) => row.order === "1").length,
      loyalClients: activeRows.filter((row) => row.order && row.order !== "1").length,
      giftsAdded: rows.filter((row) => row.status === "Gift Giver").length,
      giftsReceived: rows.filter((row) => row.status === "Gift Done").length,
      freeGifts: rows.filter((row) => row.order === "Free").length,
      twoFreeGifts: rows.filter((row) => row.order === "2 Free").length,
      clientsTurnedAway,
      commission: parseAmount(manual.commissionJoce) + parseAmount(manual.commissionCaren),
      naft: parseAmount(manual.naft),
      uber: parseAmount(manual.uber),
      purchase: parseAmount(manual.purchase),
    };
  };

  const getFinanceMonthStats = (monthKey) => {
    const monthlySettings = getFinanceMonthSettings(monthKey);
    const monthDates = getFinanceMonthDates(monthKey);
    const currentMonthKey = currentDate.slice(0, 7);
    const financeCalculationDates = monthKey === currentMonthKey
      ? monthDates.filter((date) => date <= currentDate)
      : monthDates;
    const dayStats = monthDates.map((date) => getFinanceDayStats(date, monthlySettings));
    const calculationDayStats = financeCalculationDates.map((date) =>
      getFinanceDayStats(date, monthlySettings)
    );
    const calculationDaysCount = Math.max(1, calculationDayStats.length || monthDates.length || 1);
    const fixedExpenseRatio = calculationDaysCount / Math.max(1, monthDates.length || 1);
    const sum = (selector) => calculationDayStats.reduce((total, day) => total + selector(day), 0);
    const paymentTotals = {
      Cash: sum((day) => day.paymentTotals.Cash),
      Debit: sum((day) => day.paymentTotals.Debit),
      Credit: sum((day) => day.paymentTotals.Credit),
      Tabby: sum((day) => day.paymentTotals.Tabby),
      Tamara: sum((day) => day.paymentTotals.Tamara),
      "Bank Transfer": sum((day) => day.paymentTotals["Bank Transfer"]),
      Paid: sum((day) => day.paymentTotals.Paid),
    };
    const servicesTotals = {
      Massage: sum((day) => day.servicesTotals.Massage),
      "Mani & Pedi": sum((day) => day.servicesTotals["Mani & Pedi"]),
      "Moroccan Bath": sum((day) => day.servicesTotals["Moroccan Bath"]),
      Package: sum((day) => day.servicesTotals.Package),
    };
    const totalIncome = sum((day) => day.income);
    const totalServices = Object.values(servicesTotals).reduce((total, value) => total + value, 0);
    const averageServicePrice = totalServices ? totalIncome / totalServices : 0;
    const monthlyTarget = parseAmount(monthlySettings.monthlyTarget);
    const targetByService = averageServicePrice ? monthlyTarget / averageServicePrice : 0;
    const remainingServicesToTarget = Math.max(0, targetByService - totalServices);
    const lostRevenue = sum((day) => day.clientsTurnedAway) * averageServicePrice;

    return {
      monthKey,
      monthlySettings,
      dayStats,
      totalIncome,
      totalExpenses: sum((day) => day.expenses),
      totalNetProfit: sum((day) => day.netProfit),
      averageDailyIncome: totalIncome / calculationDaysCount,
      averageDailyExpenses: sum((day) => day.expenses) / calculationDaysCount,
      averageDailyNetIncome: sum((day) => day.netProfit) / calculationDaysCount,
      lastUpdate: Math.max(
        0,
        ...dayStats
          .filter((day) => day.income || day.expenses || day.totalServices)
          .map((day) => Number(day.date.slice(8, 10)))
      ),
      paymentTotals,
      paymentTotal: Object.values(paymentTotals).reduce((total, value) => total + value, 0),
      operatingExpenses: {
        "Gas Station": sum((day) => day.naft),
        Commission: sum((day) => day.commission),
        Purchase: sum((day) => day.purchase),
        "House Rent": parseAmount(monthlySettings.houseRent) * fixedExpenseRatio,
        "Car Rent": parseAmount(monthlySettings.carRent) * fixedExpenseRatio,
        Uber: sum((day) => day.uber),
        Laundry: 0,
        Food: 0,
        "Government Fees": parseAmount(monthlySettings.governmentFees) * fixedExpenseRatio,
        Salary: parseAmount(monthlySettings.staffSalary) * fixedExpenseRatio,
      },
      servicesTotals,
      totalServices,
      newClients: sum((day) => day.newClients),
      loyalClients: sum((day) => day.loyalClients),
      giftsAdded: sum((day) => day.giftsAdded),
      giftsReceived: sum((day) => day.giftsReceived),
      freeGifts: sum((day) => day.freeGifts),
      twoFreeGifts: sum((day) => day.twoFreeGifts),
      totalTransportation: sum((day) => day.transportation),
      clientsTurnedAway: sum((day) => day.clientsTurnedAway),
      lostRevenue,
      potentialRevenue: totalIncome + lostRevenue,
      monthlyTarget,
      targetByService,
      averageServicePrice,
      remainingServicesToTarget,
    };
  };

  const getIncomeExpenseReportMonths = () => {
    const months = new Set();
    const start = new Date("2024-11-01T12:00:00");
    const current = new Date(`${currentDate.slice(0, 7)}-01T12:00:00`);

    for (
      let date = new Date(start);
      date <= current;
      date.setMonth(date.getMonth() + 1)
    ) {
      months.add(date.toISOString().slice(0, 7));
    }

    Object.keys(financeMonthlySettings || {}).forEach((monthKey) => {
      if (/^\d{4}-\d{2}$/.test(monthKey) && monthKey >= "2024-11") {
        months.add(monthKey);
      }
    });

    return Array.from(months).sort();
  };

  const getShortMonthLabel = (monthKey) => {
    const date = new Date(`${monthKey}-01T12:00:00`);
    return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
  };

  const getIncomeExpenseManualData = (monthKey) =>
    financeMonthlySettings?.[monthKey]?.incomeExpenseManual || {};

  const updateIncomeExpenseManualData = (monthKey, field, value) => {
    financeSettingsLastEditRef.current = Date.now();

    setFinanceMonthlySettings((prev) => ({
      ...prev,
      [monthKey]: {
        ...getFinanceMonthSettings(monthKey),
        ...(prev[monthKey] || {}),
        incomeExpenseManual: {
          ...((prev[monthKey] || {}).incomeExpenseManual || {}),
          [field]: value,
        },
      },
    }));
  };

  const getIncomeExpenseReportRow = (monthKey) => {
    const stats = getFinanceMonthStats(monthKey);
    const manual = getIncomeExpenseManualData(monthKey);
    const useAutoReportData = monthKey >= "2026-05";
    const valueOrAuto = (field, autoValue) => {
      const manualValue = manual[field];
      return manualValue === undefined || manualValue === ""
        ? useAutoReportData
          ? autoValue
          : 0
        : parseAmount(manualValue);
    };

    return {
      monthKey,
      date: getShortMonthLabel(monthKey),
      income: valueOrAuto("income", stats.totalIncome),
      expenses: valueOrAuto("expenses", stats.totalExpenses),
      netIncome: valueOrAuto("netIncome", stats.totalNetProfit),
      cash: valueOrAuto("cash", stats.paymentTotals.Cash),
      bankTransfer: valueOrAuto("bankTransfer", stats.paymentTotals["Bank Transfer"]),
      avgServicePrice: valueOrAuto("avgServicePrice", stats.averageServicePrice),
      newClients: valueOrAuto("newClients", stats.newClients),
      loyalClients: valueOrAuto("loyalClients", stats.loyalClients),
      giftsAdded: valueOrAuto("giftsAdded", stats.giftsAdded),
      giftsReceived: valueOrAuto("giftsReceived", stats.giftsReceived),
      free1Service: valueOrAuto("free1Service", stats.freeGifts),
      free2Services: valueOrAuto("free2Services", stats.twoFreeGifts),
      massage: valueOrAuto("massage", stats.servicesTotals.Massage),
      maniPedi: valueOrAuto("maniPedi", stats.servicesTotals["Mani & Pedi"]),
      cancelledApp: valueOrAuto("cancelledApp", stats.clientsTurnedAway),
    };
  };

  const getFilteredIncomeExpenseReportRows = () => {
    const allMonths = getIncomeExpenseReportMonths();
    const fromMonth = incomeExpensesFromMonth || allMonths[0] || "2024-11";
    const toMonth = incomeExpensesToMonth || allMonths[allMonths.length - 1] || currentDate.slice(0, 7);

    return allMonths
      .filter((monthKey) => monthKey >= fromMonth && monthKey <= toMonth)
      .map(getIncomeExpenseReportRow);
  };

  const exportFinanceMonthToExcel = (monthKey) => {
    const stats = getFinanceMonthStats(monthKey);
    const monthDates = getFinanceMonthDates(monthKey);
    const escapeXml = (value) =>
      String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    const safeSheetName = (name) => escapeXml(String(name || "Sheet").slice(0, 31));
    const isNumericCell = (value) =>
      typeof value === "number" ||
      (String(value ?? "").trim() !== "" && /^-?\d+(\.\d+)?$/.test(String(value).replace(/,/g, "")));
    const excelNumber = (value) => String(value ?? "").replace(/,/g, "");
    const cell = (value, styleId = "Body", mergeAcross = 0) => {
      const type = isNumericCell(value) && styleId !== "Title" && styleId !== "Section" && styleId !== "Header"
        ? "Number"
        : "String";
      const cellAttrs = [styleId ? `ss:StyleID="${styleId}"` : ""];
      if (mergeAcross) cellAttrs.push(`ss:MergeAcross="${mergeAcross}"`);
      return `<Cell ${cellAttrs.filter(Boolean).join(" ")}><Data ss:Type="${type}">${escapeXml(type === "Number" ? excelNumber(value) : value)}</Data></Cell>`;
    };
    const row = (values, styleId = "Body") =>
      `<Row>${values.map((value) => cell(value, styleId)).join("")}</Row>`;
    const titleRow = (title, columns = 12) =>
      `<Row>${cell(title, "Title", Math.max(0, columns - 1))}</Row>`;
    const sectionRow = (title, columns = 12) =>
      `<Row>${cell(title, "Section", Math.max(0, columns - 1))}</Row>`;
    const blankRow = () => `<Row>${cell("", "Blank")}</Row>`;
    const worksheet = (name, rows, columnCount = 12) => `
      <Worksheet ss:Name="${safeSheetName(name)}">
        <Table>
          ${Array.from({ length: columnCount }, () => '<Column ss:Width="110"/>').join("")}
          ${rows.join("")}
        </Table>
        <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
          <FreezePanes/>
          <FrozenNoSplit/>
          <SplitHorizontal>1</SplitHorizontal>
          <TopRowBottomPane>1</TopRowBottomPane>
          <ActivePane>2</ActivePane>
        </WorksheetOptions>
      </Worksheet>
    `;
    const sectionRows = (title, rows, columns = 3) => [
      sectionRow(title, columns),
      ...rows.map(([label, value]) =>
        `<Row>${cell(label, "Label")}${cell(formatCurrency(value), "Value")}${cell("", "Body")}</Row>`
      ),
    ];

    const reportSheetRows = [
      titleRow(`${getFinanceMonthLabel(monthKey)} Reports`, 12),
      ...sectionRows("Summary", [
        ["Total Income", stats.totalIncome],
        ["Total Expenses", stats.totalExpenses],
        ["Total Net Profit", stats.totalNetProfit],
        ["AVG Daily Income", stats.averageDailyIncome],
        ["AVG Daily Expenses", stats.averageDailyExpenses],
        ["AVG Daily Net Income", stats.averageDailyNetIncome],
        ["Last Update", stats.lastUpdate],
      ], 12),
      blankRow(),
      ...sectionRows("Payment Method", Object.entries(stats.paymentTotals), 12),
      blankRow(),
      ...sectionRows("Operating Expenses", Object.entries(stats.operatingExpenses), 12),
      blankRow(),
      ...sectionRows("Target", [
        ["Monthly Target", stats.monthlyTarget],
        ["Target by service", stats.targetByService],
        ["Remaining Services To Achieve Target", stats.remainingServicesToTarget],
        ["AVG Service Price", stats.averageServicePrice],
        ["Total Services", stats.totalServices],
      ], 12),
      blankRow(),
      sectionRow("Daily Income / Expenses / Net Profit", 12),
      row(["Date", "Income", "Expenses", "Net Profit"], "Header"),
      ...stats.dayStats.map((day) =>
        row([day.date, formatCurrency(day.income), formatCurrency(day.expenses), formatCurrency(day.netProfit)], "Body")
      ),
      row(["Total", formatCurrency(stats.totalIncome), formatCurrency(stats.totalExpenses), formatCurrency(stats.totalNetProfit)], "Total"),
    ];

    const scheduleHeader = scheduleColumns.map((column) => column.label);
    const makeScheduleRowValue = (scheduleRow, column) => {
      if (column.field === "frame") return scheduleRow.frame ? "TRUE" : "";
      if (column.field === "totalPrice") {
        return formatCurrency(parseAmount(scheduleRow.serviceAmount) + parseAmount(scheduleRow.transportation));
      }
      return scheduleRow[column.field] || "";
    };
    const scheduleSheets = monthDates.map((date) => {
      const rowsForDate = getRowsForDate(date);
      const dayStats = getFinanceDayStats(date, stats.monthlySettings);
      const sheetRows = [
        titleRow(`Schedule ${date}`, scheduleHeader.length),
        row(scheduleHeader, "Header"),
        ...rowsForDate.map((scheduleRow, index) =>
          row(scheduleColumns.map((column) => makeScheduleRowValue(scheduleRow, column)), index % 2 === 0 ? "Body" : "AltBody")
        ),
        blankRow(),
        sectionRow("Payment Method", scheduleHeader.length),
        ...Object.entries(dayStats.paymentTotals).map(([label, value]) =>
          row([label, formatCurrency(value)], "Body")
        ),
        row(["Total", formatCurrency(dayStats.income)], "Total"),
        blankRow(),
        sectionRow("Services", scheduleHeader.length),
        ...Object.entries(dayStats.servicesTotals).map(([label, value]) =>
          row([label, formatCurrency(value)], "Body")
        ),
        row(["Total Services", formatCurrency(dayStats.totalServices)], "Total"),
        blankRow(),
        sectionRow("Clients & Gifts", scheduleHeader.length),
        row(["New Clients", formatCurrency(dayStats.newClients)], "Body"),
        row(["Loyal Clients", formatCurrency(dayStats.loyalClients)], "Body"),
        row(["Gifts Added", formatCurrency(dayStats.giftsAdded)], "Body"),
        row(["Gifts Received", formatCurrency(dayStats.giftsReceived)], "Body"),
        row(["Free", formatCurrency(dayStats.freeGifts)], "Body"),
        row(["2 Free", formatCurrency(dayStats.twoFreeGifts)], "Body"),
        row(["Clients Turned Away", formatCurrency(dayStats.clientsTurnedAway)], "Body"),
        blankRow(),
        sectionRow("Daily Collection", scheduleHeader.length),
        row(["Total Income", formatCurrency(dayStats.income)], "Body"),
        row(["Naft", formatCurrency(dayStats.naft)], "Body"),
        row(["Uber", formatCurrency(dayStats.uber)], "Body"),
        row(["Purchase", formatCurrency(dayStats.purchase)], "Body"),
        row(["Commission", formatCurrency(dayStats.commission)], "Body"),
        row(["Daily Cost", formatCurrency(dayStats.expenses)], "Body"),
        row(["Net Profit", formatCurrency(dayStats.netProfit)], "Total"),
        row(["Total Transportation", formatCurrency(dayStats.transportation)], "Body"),
        blankRow(),
        sectionRow("Commission", scheduleHeader.length),
        row(["Joce", formatCurrency(dayStats.manual.commissionJoce)], "Body"),
        row(["Caren", formatCurrency(dayStats.manual.commissionCaren)], "Body"),
        blankRow(),
        sectionRow("Availability", scheduleHeader.length),
        ...therapistOptions.map((name) => row([name], "Body")),
      ];

      return worksheet(date, sheetRows, Math.max(scheduleHeader.length, 12));
    });

    const workbook = `<?xml version="1.0"?>
      <?mso-application progid="Excel.Sheet"?>
      <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
        xmlns:o="urn:schemas-microsoft-com:office:office"
        xmlns:x="urn:schemas-microsoft-com:office:excel"
        xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
        xmlns:html="http://www.w3.org/TR/REC-html40">
        <Styles>
          <Style ss:ID="Title"><Alignment ss:Horizontal="Center"/><Font ss:FontName="Arial" ss:Size="14" ss:Bold="1"/><Interior ss:Color="#cbb7a4" ss:Pattern="Solid"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders></Style>
          <Style ss:ID="Section"><Alignment ss:Horizontal="Center"/><Font ss:FontName="Arial" ss:Size="12" ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#7a5a43" ss:Pattern="Solid"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders></Style>
          <Style ss:ID="Header"><Alignment ss:Horizontal="Center"/><Font ss:FontName="Arial" ss:Size="11" ss:Bold="1"/><Interior ss:Color="#ead8c9" ss:Pattern="Solid"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders></Style>
          <Style ss:ID="Body"><Alignment ss:Horizontal="Center"/><Font ss:FontName="Arial" ss:Size="10"/><Interior ss:Color="#fffaf3" ss:Pattern="Solid"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders></Style>
          <Style ss:ID="AltBody"><Alignment ss:Horizontal="Center"/><Font ss:FontName="Arial" ss:Size="10"/><Interior ss:Color="#f2e7da" ss:Pattern="Solid"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders></Style>
          <Style ss:ID="Label"><Alignment ss:Horizontal="Center"/><Font ss:FontName="Arial" ss:Size="10" ss:Bold="1"/><Interior ss:Color="#fffaf3" ss:Pattern="Solid"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders></Style>
          <Style ss:ID="Value"><Alignment ss:Horizontal="Center"/><Font ss:FontName="Arial" ss:Size="10" ss:Bold="1"/><Interior ss:Color="#fffaf3" ss:Pattern="Solid"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders></Style>
          <Style ss:ID="Total"><Alignment ss:Horizontal="Center"/><Font ss:FontName="Arial" ss:Size="10" ss:Bold="1"/><Interior ss:Color="#f2a879" ss:Pattern="Solid"/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/></Borders></Style>
          <Style ss:ID="Blank"><Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/></Style>
        </Styles>
        ${worksheet("Reports", reportSheetRows, 12)}
        ${scheduleSheets.join("")}
      </Workbook>`;

    const blob = new Blob([workbook], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Paradise-${getFinanceMonthLabel(monthKey).replace(/\s+/g, "-")}-Reports.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };

  const appointmentStats = getAppointmentStats();


  // 🖼️ CARD SYSTEM
const getCardImage = (visits) => {
  // أول كرت فقط
  if (visits === 0) return card0;

  // بعد أول مرة يبدأ النظام من 1 إلى 11 ويتكرر
  const cycle = ((visits - 1) % 11) + 1;

  switch (cycle) {
    case 1:
      return card1;

    case 2:
      return card2;

    case 3:
      return card3;

    case 4:
      return card4;

    case 5:
      return card5free;

    case 6:
      return card5;

    case 7:
      return card6;

    case 8:
      return card7;

    case 9:
      return card8;

    case 10:
      return card9;

    case 11:
      return card10;

    default:
      return card10;
  }
};

  // 🏷️ LABELS
const getVisitLabel = (visits) => {
  return visits;
};

  // 📱 CLEAN SAUDI PHONE NUMBER
  const cleanSaudiPhone = (phoneNumber) => {
    let cleanPhone = phoneNumber.replace(/\D/g, "");

    if (cleanPhone.startsWith("05")) {
      cleanPhone = "966" + cleanPhone.slice(1);
    }

    if (cleanPhone.startsWith("5")) {
      cleanPhone = "966" + cleanPhone;
    }

    if (cleanPhone.startsWith("00966")) {
      cleanPhone = cleanPhone.replace("00966", "966");
    }

    return cleanPhone;
  };

  const isMobileDevice = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const createWhatsAppMessage = (client) => {
    const brownHeart = "\uD83E\uDD0E";

    return [
      "صباح الخير ..",
      `معاكي باردايس سبا ${brownHeart}`,
      `اتشرفنا بخدمتك عزيزتي ${client.name}`,
      `تم اضافة طبعة زيارة لكرت الولاء الخاص بك ${brownHeart}`,
    ].join("\n");
  };

  const copyCardImage = async (blob) => {
    try {
      if (!navigator.clipboard || !window.ClipboardItem || !blob) return false;

      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob,
        }),
      ]);

      return true;
    } catch (err) {
      console.log("Copy failed", err);
      return false;
    }
  };

  const downloadCardImageFallback = (blob, client) => {
    try {
      if (!blob) return;

      const imageUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `Paradise-Loyalty-${client.name || "client"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(imageUrl), 1000);
    } catch (err) {
      console.log("Download fallback failed", err);
    }
  };

// 🟢 WHATSAPP + COPY IMAGE HD
const sendWhatsApp = async (client) => {
  try {
    const cleanPhone = cleanSaudiPhone(client.phone);
    const message = createWhatsAppMessage(client);
    const isMobile = isMobileDevice();
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    const cardElement = document.getElementById(`card-${client.id}`);
    let blob = null;
    let imageCopied = false;

    if (cardElement) {
      const canvas = await html2canvas(cardElement, {
        scale: 4,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png", 1)
      );

      if (blob) {
        imageCopied = await copyCardImage(blob);
      }
    }

    if (!isMobile && blob && !imageCopied) {
      alert("تم تجهيز النص، لكن الصورة لم تنسخ. اضغطي السماح للنسخ إذا ظهر لك تنبيه المتصفح.");
    }

    if (isIOS && blob && !imageCopied) {
      downloadCardImageFallback(blob, client);
    }

    if (!isIOS && isMobile && blob && !imageCopied) {
      downloadCardImageFallback(blob, client);
    }

    const whatsappLink = isMobile
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`
      : `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;

    setTimeout(() => {
      if (isMobile) {
        window.location.href = whatsappLink;
      } else {
        window.open(whatsappLink, "_blank");
      }
    }, 300);
  } catch (err) {
    console.log(err);
    alert("صار خطأ أثناء تجهيز الواتساب. جربي مرة ثانية.");
  }
};

  // 🔍 SEARCH
  const clientMatchesSearch = (client, searchValue) => {
    const textSearch = String(searchValue || "").toLowerCase().trim();

    if (!textSearch) return true;

    return (
      (client.name || "").toLowerCase().includes(textSearch) ||
      (client.address || "").toLowerCase().includes(textSearch) ||
      phoneMatchesSearch(client.phone, searchValue)
    );
  };

  const filteredClients = clients.filter((c) => {
  const matchesSearch = clientMatchesSearch(c, search);

  const matchesVisits =
    loyaltyVisitsFilter === "" ||
    Number(c.visits || 0) === Number(loyaltyVisitsFilter);

  return matchesSearch && matchesVisits;
});

  // 🔍 CLIENTS TABLE SEARCH
  const filteredClientsTable = clients.filter((c) =>
    clientMatchesSearch(c, clientsSearch)
  );

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  const getComparablePhone = (phoneValue) =>
    normalizePhone(formatSaudiPhoneForStorage(phoneValue));

  const clientPhoneSet = new Set(
    clients
      .map((client) => getComparablePhone(client.phone))
      .filter((phoneValue) => phoneValue.length >= 9)
  );

  const isExistingClientPhone = (phoneValue) => {
    const comparablePhone = getComparablePhone(phoneValue);

    return comparablePhone.length >= 9 && clientPhoneSet.has(comparablePhone);
  };

  const referredClients = manualReferrals.map((referral) => ({
    ...referral,
    sourceClientName: referral.sourceClientName || "",
    sourceClientPhone: referral.sourceClientPhone || "",
    manual: true,
  }));

  const referralPhoneCounts = referredClients.reduce((counts, referral) => {
    const comparablePhone = getComparablePhone(referral.phone);

    if (comparablePhone.length >= 9) {
      counts[comparablePhone] = (counts[comparablePhone] || 0) + 1;
    }

    return counts;
  }, {});

  const getReferralDuplicateCount = (phoneValue) => {
    const comparablePhone = getComparablePhone(phoneValue);

    return comparablePhone.length >= 9 ? referralPhoneCounts[comparablePhone] || 0 : 0;
  };

  const matchesCustomerStatusFilter = (phoneValue, filterValue) => {
    const existsInClients = isExistingClientPhone(phoneValue);

    if (filterValue === "existing") return existsInClients;
    if (filterValue === "notExisting") return !existsInClients;

    return true;
  };

  const filteredReferredClients = referredClients.filter((referral) => {
    const textSearch = String(referralsSearch || "").toLowerCase().trim();
    const matchesSearch =
      !textSearch ||
      (referral.name || "").toLowerCase().includes(textSearch) ||
      (referral.sourceClientName || "").toLowerCase().includes(textSearch) ||
      phoneMatchesSearch(referral.phone, referralsSearch) ||
      phoneMatchesSearch(referral.sourceClientPhone, referralsSearch);

    return (
      matchesSearch &&
      matchesCustomerStatusFilter(referral.phone, referralsCustomerFilter)
    );
  });


  // 👤 CLIENT SERVICE HISTORY FROM SCHEDULE
  const getClientServiceSummary = (client) => {
    const clientPhone = normalizePhone(client.phone);
    const serviceHistory = [];
    let totalPaid = 0;

    Object.entries(scheduleData).forEach(([date, dayData]) => {
      const rows = dayData?.rows || [];

      rows.forEach((row) => {
        const sameClient =
          normalizePhone(row.number) === clientPhone && clientPhone !== "";

        if (!sameClient || row.status === "Cancel") return;

        const hasRealAppointment =
          row.therapist || row.serviceAmount || row.transportation || row.clientBy;

        if (!hasRealAppointment) return;

        totalPaid +=
          parseAmount(row.serviceAmount) + parseAmount(row.transportation);

        serviceHistory.push({
          date,
          therapist: row.therapist || "-",
          serviceTime: row.serviceTime || "",
          clientBy: row.clientBy || "",
        });
      });
    });

    serviceHistory.sort((a, b) => {
      if (a.date === b.date) return a.serviceTime.localeCompare(b.serviceTime);
      return a.date.localeCompare(b.date);
    });

    return {
      serviceHistory,
      totalPaid,
      lastVisitDate:
        serviceHistory.length > 0
          ? serviceHistory[serviceHistory.length - 1].date
          : "",
    };
  };

  const selectedClientServiceSummary = selectedClient
    ? getClientServiceSummary(selectedClient)
    : { serviceHistory: [], totalPaid: 0, lastVisitDate: "" };

  const getDateOffset = (offset) => {
    const date = new Date(`${currentDate}T12:00:00`);
    date.setDate(date.getDate() + offset);
    return date.toISOString().slice(0, 10);
  };

  const formatShortArabicDate = (dateString) => {
    const date = new Date(`${dateString}T12:00:00`);
    return date.toLocaleDateString("ar-SA", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const formatEnglishDigits = (value) =>
    String(value ?? "")
      .replace(/[٠-٩]/g, (digit) => "٠١٢٣٤٥٦٧٨٩".indexOf(digit))
      .replace(/[۰-۹]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹".indexOf(digit));

  const formatAppointmentMessageDate = (dateString) => {
    const date = new Date(`${dateString}T12:00:00`);
    const weekday = date.toLocaleDateString("ar-SA", { weekday: "long" });
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const day = date.getDate();

    return formatEnglishDigits(`${weekday} ${day} ${month}`);
  };

  const formatNumericDate = (dateString) => {
    const date = new Date(`${dateString}T12:00:00`);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const changeScheduleDateByDays = (days) => {
    const date = new Date(`${selectedScheduleDate || todayDate}T12:00:00`);
    date.setDate(date.getDate() + days);
    setSelectedScheduleDate(date.toISOString().slice(0, 10));
  };

  const getDashboardAppointments = (date) => {
    return getRowsForDate(date)
      .filter(
        (row) =>
          row.status !== "Cancel" &&
          row.status !== "Gift Giver" &&
          (row.client || row.number || row.services)
      )
      .map((row, index) => {
        const matchedClient = clients.find(
          (client) => normalizePhone(client.phone) === normalizePhone(row.number)
        );

        return {
          ...row,
          index,
          displayName: row.client || matchedClient?.name || "عميلة بدون اسم",
          displayPhone: row.number || matchedClient?.phone || "",
          displayAddress: row.district || matchedClient?.address || "-",
          displayOrder: row.order || "-",
          matchedClientId: matchedClient?.id || null,
        };
      });
  };

  const getAppointmentTotalPrice = (appointment) =>
    parseAmount(appointment.serviceAmount) + parseAmount(appointment.transportation);

  const openAppointmentWhatsApp = (appointment, date, messageType = "confirm") => {
    const cleanPhone = cleanSaudiPhone(appointment.displayPhone || appointment.number || "");

    if (!cleanPhone) {
      alert("رقم الجوال غير موجود لهذا الموعد");
      return;
    }

    const appointmentDate = formatAppointmentMessageDate(date);
    const totalPrice = getAppointmentTotalPrice(appointment);
    const servicePriceText = totalPrice > 0 ? `${formatEnglishDigits(totalPrice)} ريال` : "-";
    const appointmentServiceTime = formatEnglishDigits(appointment.serviceTime || "-");

    const message =
      messageType === "reminder"
        ? [
            "مساء الخير",
            `كنت حابه اذكرك بموعد استاذه ${appointment.displayName || ""} ${appointmentDate} ان شاءالله مابين الساعه ${appointmentServiceTime} 💗`,
          ].join("\n")
        : [
            `تم تأكيد موعدك يوم ${appointmentDate}`,
            "",
            `الموقع: ${formatEnglishDigits(appointment.displayAddress || appointment.district || "-")}`,
            "",
            `الخدمة: ${formatEnglishDigits(appointment.services || "-")}`,
            "",
            `سعر الخدمة: ${servicePriceText} شامله رسوم التوصيل`,
            "",
            `موعد الخدمة : ${appointmentDate} مابين الساعة ${appointmentServiceTime}`,
            "",
            "الدفع بيكون بعد الخدمة كاش او تحويل",
            "",
            "نتمنى ان تنال خدمتنا رضاكي🤍.",
          ].join("\n");

    const whatsappAppLink = `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
    window.location.href = whatsappAppLink;
  };

  const openStaffAppointmentWhatsApp = (appointment, date, staffName) => {
    const staffPhone = staffWhatsAppNumbers[staffName];

    if (!staffPhone) {
      alert("اختاري اسم الأخصائية أولاً");
      return;
    }

    const cleanPhone = cleanSaudiPhone(staffPhone);
    const appointmentDate = formatAppointmentDate(date);
    const appointmentTime = appointment.serviceTime || "-";
    const leavingTime = addMinutesToDisplayTime(appointmentTime, 75);

    const message = [
      appointmentDate,
      `Staff’s Name: ${staffName}`,
      `Appointment time: ${appointmentTime}`,
      "",
      "Service:",
      appointment.services || "-",
      "",
      "Payment: will transfer",
      `Clients Name : ${appointment.displayName || appointment.client || "-"}`,
      `Leaving Time: ${leavingTime}`,
    ].join("\n");

    window.location.href = `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
  };


  const todayAppointments = getDashboardAppointments(todayDate);
  const tomorrowDate = getDateOffset(1);
  const dayAfterTomorrowDate = getDateOffset(2);
  const tomorrowAppointments = getDashboardAppointments(tomorrowDate);
  const dayAfterTomorrowAppointments = getDashboardAppointments(dayAfterTomorrowDate);
  const dashboardSearchResults = String(dashboardSearch || "").trim()
    ? clients
        .filter((client) => clientMatchesSearch(client, dashboardSearch))
        .slice(0, 8)
    : [];

  const dashboardServices = [
    ["appointments", "جدول المواعيد"],
    ["clients", "عملائنا"],
    ["loyalty", "كروت الولاء"],
    ["giftClients", "عملاء الإهداء"],
    ["referrals", "العملاء المرشحين"],
    ["potentialClients", "العملاء المحتملين"],
    ["availableAppointments", "المواعيد المتاحة"],
    ["printFrame", "طباعة اللوحة الترحيبية"],
    ["finance", "التقارير"],
    ["incomeExpenses", "الدخل والمصاريف"],
  ];

  const openDirectWhatsApp = (phoneNumber) => {
    const cleanPhone = cleanSaudiPhone(phoneNumber || "");

    if (!cleanPhone) {
      alert("رقم الجوال غير موجود");
      return;
    }

    window.location.href = `whatsapp://send?phone=${cleanPhone}`;
  };

  const addManualReferral = async () => {
    if (!referralName && !referralPhone && !referralSourceName && !referralSourcePhone) return;

    const { error } = await supabase.from("referred_clients").insert([
      {
        name: referralName,
        phone: formatSaudiPhoneForStorage(referralPhone),
        source_client_name: referralSourceName,
        source_client_phone: formatSaudiPhoneForStorage(referralSourcePhone),
      },
    ]);

    if (error) {
      console.log(error);
      return;
    }

    fetchManualReferrals();
    setReferralName("");
    setReferralPhone("");
    setReferralSourceName("");
    setReferralSourcePhone("");
    setShowReferralForm(false);
  };

  const addPotentialClient = async () => {
    if (!potentialName || !potentialPhone) return;

    const { error } = await supabase.from("potential_clients").insert([
      {
        name: potentialName,
        phone: formatSaudiPhoneForStorage(potentialPhone),
        status: potentialStatus || "إلغاء موعد",
      },
    ]);

    if (error) {
      console.log(error);
      return;
    }

    fetchPotentialClients();
    setPotentialName("");
    setPotentialPhone("");
    setPotentialStatus("إلغاء موعد");
    setShowPotentialForm(false);
  };

  const filteredPotentialClients = potentialClients.filter((client) => {
    const textSearch = String(potentialSearch || "").toLowerCase().trim();
    const matchesSearch =
      !textSearch ||
      (client.name || "").toLowerCase().includes(textSearch) ||
      (client.status || "").toLowerCase().includes(textSearch) ||
      phoneMatchesSearch(client.phone, potentialSearch);

    return (
      matchesSearch &&
      matchesCustomerStatusFilter(client.phone, potentialCustomerFilter)
    );
  });

  const addGiftClient = async () => {
    if (!giftFromName && !giftFromPhone && !giftToName && !giftToPhone) return;

    const { error } = await supabase.from("gift_clients").insert([
      {
        from_name: giftFromName,
        from_phone: formatSaudiPhoneForStorage(giftFromPhone),
        to_name: giftToName,
        to_phone: formatSaudiPhoneForStorage(giftToPhone),
        gift_date: giftDate || getCurrentLocalDate(),
        service: giftService,
        items: giftItems,
      },
    ]);

    if (error) {
      console.log(error);
      return;
    }

    fetchGiftClients();
    setGiftFromName("");
    setGiftFromPhone("");
    setGiftToName("");
    setGiftToPhone("");
    setGiftDate(getCurrentLocalDate());
    setGiftService("");
    setGiftItems({
      balloon: false,
      flowers: false,
      cake: false,
    });
    setShowGiftForm(false);
  };

  const getReferralEditId = (referral) =>
    `${referral.manual ? "manual" : "profile"}-${referral.id || referral.phone || referral.name}`;

  const startEditReferral = (referral) => {
    setEditingReferralId(getReferralEditId(referral));
    setEditedReferralName(referral.name || "");
    setEditedReferralPhone(referral.phone || "");
    setEditedReferralSourceName(referral.sourceClientName || "");
    setEditedReferralSourcePhone(referral.sourceClientPhone || "");
  };

  const cancelEditReferral = () => {
    setEditingReferralId(null);
    setEditedReferralName("");
    setEditedReferralPhone("");
    setEditedReferralSourceName("");
    setEditedReferralSourcePhone("");
  };

  const saveEditedReferral = async (referral) => {
    const { error } = await supabase
      .from("referred_clients")
      .update({
        name: editedReferralName,
        phone: formatSaudiPhoneForStorage(editedReferralPhone),
        source_client_name: editedReferralSourceName,
        source_client_phone: formatSaudiPhoneForStorage(editedReferralSourcePhone),
      })
      .eq("id", referral.id);

    if (error) {
      console.log(error);
      return;
    }

    fetchManualReferrals();
    cancelEditReferral();
  };

  const deleteReferral = async (referral) => {
    const confirmDelete = window.confirm("هل أنت متأكد من حذف العميلة المرشحة؟");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("referred_clients")
      .delete()
      .eq("id", referral.id);

    if (error) {
      console.log(error);
      return;
    }

    if (referral.sourceClientId && referral.sourceReferralId) {
      const sourceClient = clients.find((client) => client.id === referral.sourceClientId);
      if (sourceClient) {
        const updatedReferrals = (sourceClient.referrals || []).filter(
          (item) => String(item.id) !== String(referral.sourceReferralId)
        );
        await supabase
          .from("clients")
          .update({ referrals: updatedReferrals })
          .eq("id", sourceClient.id);
        setClients((prev) =>
          prev.map((client) =>
            String(client.id) === String(sourceClient.id)
              ? { ...client, referrals: updatedReferrals }
              : client
          )
        );
      }
    }

    fetchManualReferrals();
  };

  const startEditGift = (gift) => {
    setEditingGiftId(gift.id);
    setEditedGiftFromName(gift.fromName || "");
    setEditedGiftFromPhone(gift.fromPhone || "");
    setEditedGiftToName(gift.toName || "");
    setEditedGiftToPhone(gift.toPhone || "");
    setEditedGiftService(gift.service || "");
    setEditedGiftItems({
      balloon: Boolean(gift.items?.balloon),
      flowers: Boolean(gift.items?.flowers),
      cake: Boolean(gift.items?.cake),
    });
  };

  const cancelEditGift = () => {
    setEditingGiftId(null);
    setEditedGiftFromName("");
    setEditedGiftFromPhone("");
    setEditedGiftToName("");
    setEditedGiftToPhone("");
    setEditedGiftService("");
    setEditedGiftItems({
      balloon: false,
      flowers: false,
      cake: false,
    });
  };

  const saveEditedGift = async (id) => {
    const { error } = await supabase
      .from("gift_clients")
      .update({
        from_name: editedGiftFromName,
        from_phone: formatSaudiPhoneForStorage(editedGiftFromPhone),
        to_name: editedGiftToName,
        to_phone: formatSaudiPhoneForStorage(editedGiftToPhone),
        service: editedGiftService,
        items: editedGiftItems,
      })
      .eq("id", id);

    if (error) {
      console.log(error);
      return;
    }

    fetchGiftClients();
    cancelEditGift();
  };

  const updateGiftTaken = async (gift, giftTaken) => {
    const updatedItems = {
      ...(gift.items || {}),
      giftTaken,
    };

    setGiftClients((prev) =>
      prev.map((item) =>
        item.id === gift.id
          ? { ...item, items: updatedItems, giftTaken }
          : item
      )
    );

    const { error } = await supabase
      .from("gift_clients")
      .update({ items: updatedItems })
      .eq("id", gift.id);

    if (error) {
      console.log(error);
      fetchGiftClients();
      return;
    }

    fetchGiftClients();
  };

  const deleteGiftClient = async (id) => {
    const confirmDelete = window.confirm("هل أنت متأكد من حذف عميلة الإهداء؟");
    if (!confirmDelete) return;

    const { error } = await supabase.from("gift_clients").delete().eq("id", id);

    if (error) {
      console.log(error);
      return;
    }

    fetchGiftClients();
  };

  const startEditPotentialClient = (client) => {
    setEditingPotentialId(client.id);
    setEditedPotentialName(client.name || "");
    setEditedPotentialPhone(client.phone || "");
    setEditedPotentialStatus(client.status || "");
  };

  const cancelEditPotentialClient = () => {
    setEditingPotentialId(null);
    setEditedPotentialName("");
    setEditedPotentialPhone("");
    setEditedPotentialStatus("");
  };

  const saveEditedPotentialClient = async (id) => {
    const { error } = await supabase
      .from("potential_clients")
      .update({
        name: editedPotentialName,
        phone: formatSaudiPhoneForStorage(editedPotentialPhone),
        status: editedPotentialStatus || "إلغاء موعد",
      })
      .eq("id", id);

    if (error) {
      console.log(error);
      return;
    }

    fetchPotentialClients();
    cancelEditPotentialClient();
  };

  const deletePotentialClient = async (id) => {
    const confirmDelete = window.confirm("هل أنت متأكد من حذف العميلة المحتملة؟");
    if (!confirmDelete) return;

    const { error } = await supabase.from("potential_clients").delete().eq("id", id);

    if (error) {
      console.log(error);
      return;
    }

    fetchPotentialClients();
  };

  const filteredGiftClients = giftClients.filter((gift) => {
    const textSearch = String(giftSearch || "").toLowerCase().trim();
    const matchesGiftStatus =
      giftStatusFilter === "all" ||
      (giftStatusFilter === "taken" && gift.giftTaken) ||
      (giftStatusFilter === "pending" && !gift.giftTaken);

    if (!matchesGiftStatus) return false;
    if (!textSearch) return true;

    return (
      (gift.fromName || "").toLowerCase().includes(textSearch) ||
      (gift.toName || "").toLowerCase().includes(textSearch) ||
      (gift.service || "").toLowerCase().includes(textSearch) ||
      phoneMatchesSearch(gift.fromPhone, giftSearch) ||
      phoneMatchesSearch(gift.toPhone, giftSearch)
    );
  });


  const luxuryHover = (event, active = true) => {
    event.currentTarget.style.transform = active ? "translateY(-3px) scale(1.01)" : "translateY(0) scale(1)";
    event.currentTarget.style.boxShadow = active
      ? "0 20px 42px rgba(75,46,31,0.18)"
      : "0 12px 30px rgba(75,46,31,0.10)";
  };

  const appointmentCard = (appointment, date) => {
    const linkedClient = appointment.matchedClientId
      ? clients.find((client) => client.id === appointment.matchedClientId)
      : clients.find((client) => normalizePhone(client.phone) === normalizePhone(appointment.displayPhone));
    const appointmentTotal = getAppointmentTotalPrice(appointment);
    const appointmentKey = `${date}-${appointment.index}`;
    const selectedStaff = appointmentStaffSelections[appointmentKey] || "";

    return (
      <div
        key={appointmentKey}
        onMouseEnter={(e) => luxuryHover(e, true)}
        onMouseLeave={(e) => luxuryHover(e, false)}
        style={{
          background: "linear-gradient(145deg, rgba(255,255,255,0.95), rgba(250,247,242,0.88))",
          border: "1px solid rgba(214,199,184,0.9)",
          borderRadius: "20px",
          padding: "14px",
          marginBottom: "10px",
          color: "#4b2e1f",
          boxShadow: "0 10px 24px rgba(75,46,31,0.10)",
          transition: "0.25s ease",
          direction: "rtl",
          textAlign: "right",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "center" }}>
          <button
            onClick={() => linkedClient && openClientProfile(linkedClient)}
            style={{
              border: "none",
              background: "transparent",
              color: "#4b2e1f",
              fontSize: "17px",
              fontWeight: "800",
              cursor: linkedClient ? "pointer" : "default",
              padding: 0,
              textAlign: "right",
            }}
          >
            {appointment.displayName}
          </button>
          <span
            style={{
              backgroundColor: "#d8c5b3",
              color: "black",
              borderRadius: "999px",
              padding: "5px 9px",
              fontSize: "11px",
              whiteSpace: "nowrap",
              fontWeight: "bold",
            }}
          >
            خدمة {appointment.displayOrder}
          </span>
        </div>

        <div
          style={{
            marginTop: "10px",
            color: "#6f6259",
            fontSize: "13px",
            lineHeight: "1.8",
            fontWeight: "700",
            textAlign: "right",
          }}
        >
          <div>الجوال: {appointment.displayPhone || "-"}</div>
          <div>الوقت: {appointment.serviceTime || "-"}</div>
          <div>الحي: {appointment.displayAddress || "-"}</div>
          <div>السعر مع التوصيل: {appointmentTotal > 0 ? `${appointmentTotal} ريال` : "-"}</div>
          <div>الخدمة: {appointment.services || "-"}</div>
          <div>الأخصائية: {appointment.therapist || "-"}</div>
        </div>

        <div
          style={{
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
  alignItems: "center",
  marginTop: "12px",
}}
        >
          <button
            onClick={() => openAppointmentWhatsApp(appointment, date, "confirm")}
           style={{
  ...buttonStyle,
  width: "100%",
  height: "38px",
  minHeight: "38px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #d8c5b3, #f3e8df)",
  color: "black",
  borderRadius: "14px",
  
  fontSize: "12px",
  padding: "0 10px",
  margin: 0,
  boxSizing: "border-box",
}}
          >
            تأكيد الحجز
          </button>

          <button
            onClick={() => openAppointmentWhatsApp(appointment, date, "reminder")}
            style={{
  ...buttonStyle,
  width: "100%",
  height: "38px",
  minHeight: "38px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #d8c5b3, #f3e8df)",
  color: "black",
  borderRadius: "14px",
  boxShadow: "0 8px 18px rgba(75,46,31,0.16)",
  fontSize: "12px",
  padding: "0 10px",
  margin: 0,
  boxSizing: "border-box",
}}
          >
            تذكير الموعد
          </button>
        </div>

        <div
          style={{
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
  alignItems: "center",
  marginTop: "8px",
}}
        >
          <select
            value={selectedStaff}
            onChange={(event) =>
              setAppointmentStaffSelections((prev) => ({
                ...prev,
                [appointmentKey]: event.target.value,
              }))
            }
            style={{
  ...inputStyle,
  width: "100%",
  height: "38px",
  minHeight: "38px",
  borderRadius: "14px",
  fontSize: "13px",
  fontWeight: "700",
  padding: "0 10px",
  textAlign: "center",
  margin: 0,
  boxSizing: "border-box",
}}
          >
            <option value="">الأخصائية</option>
            <option value="Joce">Joce</option>
            <option value="Caren">Caren</option>
          </select>

          <button
            onClick={() => openStaffAppointmentWhatsApp(appointment, date, selectedStaff)}
           style={{
  ...buttonStyle,
  width: "100%",
  height: "38px",
  minHeight: "38px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #d8c5b3, #f3e8df)",
  color: "black",
  borderRadius: "14px",
  boxShadow: "0 8px 18px rgba(75,46,31,0.16)",
  fontSize: "12px",
  padding: "0 10px",
  margin: 0,
  boxSizing: "border-box",
}}
          >
            إرسال موعد
          </button>
        </div>
      </div>
    );
  };





  const renderLoyaltyCard = (loyaltyClient) => (
          <div
            style={{
              margin: "0 auto",
              backgroundColor: "#fff",
              borderRadius: "28px",
              padding: "14px",
              width: "100%",
              maxWidth: "500px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
              position: "relative",
            }}
          >
            <button
              onClick={() => deleteClient(loyaltyClient)}
              title="حذف العميلة"
              style={{
                position: "absolute",
                top: "12px",
                left: "12px",
                border: "none",
                background: "linear-gradient(135deg, #7a2f2f, #c26a5a)",
                color: "white",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                cursor: "pointer",
                fontWeight: "bold",
                zIndex: 5,
                boxShadow: "0 8px 18px rgba(122,47,47,0.20)",
              }}
            >
              ×
            </button>

            <button
              onClick={() => startEditClient(loyaltyClient)}
              style={smallEditButtonStyle}
            >
              ✎
            </button>

            {/* CARD */}
            <div
              id={`card-${loyaltyClient.id}`}
              style={{
                width: "340px",
                height: "210px",
                margin: "0 auto",
                borderRadius: "0px",
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                backgroundColor: "white",
              }}
            >
              <img
                src={getCardImage(loyaltyClient.visits)}
                alt=""
                crossOrigin="anonymous"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  imageRendering: "auto",
                  borderRadius: "0px",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "14px",
                  backgroundColor: "rgba(255,255,255,0.85)",
                  padding: "7px 12px",
                  borderRadius: "12px",
                  fontWeight: "bold",
                  fontSize: "14px",
                  color: "#4b2e1f",
                }}
              >
                {loyaltyClient.name}
              </div>
            </div>

            {/* INFO */}
            <div style={{ marginTop: "15px" }}>
              {editingId === loyaltyClient.id ? (
                <div
                  style={{
                    backgroundColor: "#faf7f2",
                    borderRadius: "18px",
                    padding: "14px",
                    marginBottom: "12px",
                    boxShadow: "inset 0 0 0 1px rgba(214,199,184,0.5)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      marginBottom: "10px",
                    }}
                  >
                    <span
                      style={{
                        minWidth: "70px",
                        color: "#7a6a58",
                        fontWeight: "bold",
                        fontSize: "13px",
                      }}
                    >
                      الاسم
                    </span>

                    <input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      style={editInputStyle}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      marginBottom: "10px",
                    }}
                  >
                    <span
                      style={{
                        minWidth: "70px",
                        color: "#7a6a58",
                        fontWeight: "bold",
                        fontSize: "13px",
                      }}
                    >
                      الجوال
                    </span>

                    <input
                      value={editedPhone}
                      onChange={(e) => setEditedPhone(e.target.value)}
                      onBlur={() => setEditedPhone(formatSaudiPhoneForStorage(editedPhone))}
                      style={editInputStyle}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      marginBottom: "12px",
                    }}
                  >
                    <span
                      style={{
                        minWidth: "70px",
                        color: "#7a6a58",
                        fontWeight: "bold",
                        fontSize: "13px",
                      }}
                    >
                      العنوان
                    </span>

                    <input
                      value={editedAddress}
                      onChange={(e) => setEditedAddress(e.target.value)}
                      style={editInputStyle}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <button
                      onClick={() => saveEditClient(loyaltyClient.id)}
                      style={{
                        ...buttonStyle,
                        backgroundColor: "#4b2e1f",
                        color: "white",
                        padding: "9px 18px",
                      }}
                    >
                      حفظ
                    </button>

                    <button
                      onClick={cancelEditClient}
                      style={{
                        ...buttonStyle,
                        backgroundColor: "#d8c5b3",
                        color: "#4b2e1f",
                        padding: "9px 18px",
                      }}
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    background:
                      "linear-gradient(to right, #94877d, #9e948e)",
                    borderRadius: "22px",
                    padding: "12px 14px",
                    color: "white",
                    boxShadow: "0 8px 20px rgba(75,46,31,0.15)",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "8px",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderRadius: "14px",
                        padding: "9px",
                      }}
                    >
                      <div style={{ fontSize: "11px", opacity: 0.8 }}>الاسم</div>
                      <strong>{loyaltyClient.name}</strong>
                    </div>

                    <div
                      style={{
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderRadius: "14px",
                        padding: "9px",
                      }}
                    >
                      <div style={{ fontSize: "11px", opacity: 0.8 }}>الجوال</div>
                      <strong>{loyaltyClient.phone}</strong>
                    </div>

                    <div
                      style={{
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderRadius: "14px",
                        padding: "9px",
                      }}
                    >
                      <div style={{ fontSize: "11px", opacity: 0.8 }}>العنوان</div>
                      <strong>{loyaltyClient.address || "-"}</strong>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "28px",
                      fontWeight: "bold",
                      color: "white",
                      width: "100%",
                      maxWidth: "360px",
                      margin: "0 auto",
                      direction: "ltr",
                    }}
                  >
                    <span
                      style={{
                        whiteSpace: "nowrap",
                        textAlign: "left",
                      }}
                    >
                      Visits: {getVisitLabel(loyaltyClient.visits)}
                    </span>

                    <label
                      style={{
                        display: "inline-flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "8px",
                        margin: 0,
                        whiteSpace: "nowrap",
                        textAlign: "right",
                        direction: "rtl",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={loyaltyClient.frame || false}
                        onChange={(e) => updateClientFrame(loyaltyClient.id, e.target.checked)}
                        style={{ width: "17px", height: "17px" }}
                      />
                      اللوحة الترحيبية
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* BUTTONS */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                marginTop: "16px",
              }}
            >
              <button
                onClick={() => addVisit(loyaltyClient.id)}
                style={{
                  ...buttonStyle,
                  minWidth: "92px",
                  height: "46px",
                  padding: "0 18px",
                  borderRadius: "18px",
                  background: "linear-gradient(135deg, #4b2e1f, #7a5a43)",
                  color: "white",
                  boxShadow: "0 10px 22px rgba(75,46,31,0.18)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                + Visit
              </button>

              <button
                onClick={() => removeVisit(loyaltyClient.id)}
                style={{
                  ...buttonStyle,
                  minWidth: "92px",
                  height: "46px",
                  padding: "0 18px",
                  borderRadius: "18px",
                  background: "linear-gradient(135deg, #d8c5b3, #f3e8df)",
                  color: "#4b2e1f",
                  boxShadow: "0 10px 22px rgba(75,46,31,0.10)",
                  border: "1px solid #d6c7b8",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                - Visit
              </button>

              <button
                onClick={() => sendWhatsApp(loyaltyClient)}
                style={{
                  ...buttonStyle,
                  minWidth: "118px",
                  height: "46px",
                  padding: "0 20px",
                  borderRadius: "18px",
                  background: "linear-gradient(135deg, #1f9f54, #25D366)",
                  color: "white",
                  boxShadow: "0 10px 22px rgba(37,211,102,0.22)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                WhatsApp
              </button>
            </div>
          </div>
  );

  const renderLoadMoreButtons = (visibleCount, setVisibleCount, totalCount) => {
    if (totalCount <= 15) return null;

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginTop: "20px",
          flexWrap: "wrap",
        }}
      >
        {visibleCount < totalCount && (
          <button
            onClick={() => setVisibleCount((prev) => Math.min(prev + 15, totalCount))}
            style={{
              ...buttonStyle,
              backgroundColor: "#4b2e1f",
              color: "white",
              minWidth: "140px",
            }}
          >
            عرض المزيد
          </button>
        )}

        <button
          onClick={() => setVisibleCount(totalCount)}
          style={{
            ...buttonStyle,
            backgroundColor: "#d8c5b3",
            color: "#4b2e1f",
            minWidth: "140px",
          }}
        >
          عرض الكل
        </button>
      </div>
    );
  };


  // 🎨 STYLES
  const inputStyle = {
    width: "90%",
    padding: "14px",
    marginBottom: "12px",
    borderRadius: "16px",
    border: "1px solid #d6c7b8",
    backgroundColor: "#faf7f2",
    outline: "none",
    fontSize: "15px",
    transition: "0.3s",
  };

  const editInputStyle = {
    width: "80%",
    padding: "10px 12px",
    borderRadius: "14px",
    border: "1px solid #d6c7b8",
    backgroundColor: "#faf7f2",
    outline: "none",
    fontSize: "14px",
    textAlign: "center",
    color: "#4b2e1f",
  };

  const buttonStyle = {
    border: "none",
    borderRadius: "14px",
    padding: "12px 18px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.2s",
  };

  const smallEditButtonStyle = {
    border: "none",
    borderRadius: "50%",
    width: "28px",
    height: "28px",
    cursor: "pointer",
    backgroundColor: "#f3e8df",
    color: "#4b2e1f",
    fontWeight: "bold",
    boxShadow: "0 3px 8px rgba(0,0,0,0.06)",
    position: "absolute",
    top: "12px",
    left: "48px",
    zIndex: 5,
  };

  const scheduleCellStyle = {
    border: "1px solid rgba(75,46,31,0.22)",
    padding: "0 2px",
    textAlign: "center",
    verticalAlign: "middle",
    height: "20px",
    lineHeight: "18px",
    userSelect: "none",
  };

  const scheduleInputStyle = {
    border: "none",
    background: "transparent",
    textAlign: "center",
    fontSize: "inherit",
    fontWeight: "700",
    color: "#111",
    outline: "none",
    borderRadius: "0px",
    padding: "0 1px",
    boxSizing: "border-box",
    height: "18px",
    lineHeight: "16px",
  };

  const scheduleTableWrapperStyle = {
    overflowX: "auto",
    overflowY: "visible",
    border: "1px solid rgba(139,105,79,0.24)",
    borderRadius: "12px",
    marginBottom: "6px",
    maxHeight: "none",
    background: "#fffaf3",
    boxShadow: "0 12px 28px rgba(75,46,31,0.08)",
    WebkitOverflowScrolling: "touch",
    touchAction: "pan-x pan-y",
    overscrollBehaviorX: "contain",
    overscrollBehaviorY: "auto",
  };

  const scheduleHeaderCellStyle = {
    padding: "2px 5px",
    border: "1px solid rgba(75,46,31,0.22)",
    whiteSpace: "nowrap",
    background: "#ead8c9",
    color: "#111",
    position: "sticky",
    top: 0,
    zIndex: 2,
    fontSize: "14px",
    fontWeight: "800",
    lineHeight: "18px",
    height: "22px",
  };

  const scheduleDataCellStyle = {
    ...scheduleCellStyle,
  };

  const getScheduleRowStyle = (row, index) => ({
    backgroundColor:
      statusColors[row.status] ||
      (index % 2 === 0 ? "#fffaf3" : "#f2e7da"),
  });

  const scheduleSummaryCardStyle = {
    border: "1px solid rgba(214,199,184,0.92)",
    borderRadius: "24px",
    overflow: "hidden",
    background: "linear-gradient(145deg, rgba(255,255,255,0.92), rgba(250,247,242,0.84))",
    boxShadow: "0 16px 36px rgba(75,46,31,0.08)",
  };

  const scheduleSummaryHeaderStyle = {
    background: "linear-gradient(135deg, #4b2e1f, #7a5a43)",
    color: "white",
    margin: 0,
    padding: "12px",
    textAlign: "center",
  };

  const scheduleSummaryRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 14px",
    borderTop: "1px solid rgba(234,223,213,0.95)",
    color: "#4b2e1f",
    gap: "10px",
  };

  const scheduleSummaryInputStyle = {
    width: "90px",
    padding: "7px",
    borderRadius: "12px",
    border: "1px solid #d6c7b8",
    textAlign: "center",
    background: "#fffaf3",
    color: "#4b2e1f",
    fontWeight: "700",
  };

  const luxuryPageStyle = {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, #fffaf3, #ebe1d3 45%, #d8c5b3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
    fontFamily: "Arial",
  };

  const luxuryCardStyle = {
    width: "480px",
    minHeight: "480px",
    backgroundColor: "rgba(255,255,255,0.82)",
    borderRadius: "34px",
    padding: "38px 28px",
    boxShadow: "0 25px 60px rgba(75,46,31,0.18)",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.7)",
    backdropFilter: "blur(10px)",
  };

  const placeholderPage = (title) => (
    <div style={luxuryPageStyle}>
      <div style={luxuryCardStyle}>
        <button
          onClick={() => setScreen("dashboard")}
          style={{
            ...buttonStyle,
            backgroundColor: "#faf7f2",
            color: "#4b2e1f",
            padding: "8px 16px",
            border: "1px solid #d6c7b8",
            borderRadius: "16px",
            fontSize: "13px",
            marginBottom: "25px",
          }}
        >
          Back
        </button>

        <img
          src={logo}
          alt="logo"
          style={{
            width: "120px",
            marginBottom: "25px",
          }}
        />

        <h2
          style={{
            color: "#4b2e1f",
            fontSize: "28px",
            marginBottom: "15px",
          }}
        >
          {title}
        </h2>

        <p
          style={{
            color: "#8a7a68",
            fontSize: "15px",
          }}
        >
          سيتم تجهيز هذه الصفحة في الخطوة القادمة.
        </p>
      </div>
    </div>
  );

  const welcomeBoardTemplates = [
    {
      id: "woman",
      title: "لوحة لسيدة",
      image: welcomeWoman,
      icon: "",
    },
    {
      id: "man",
      title: "لوحة لرجل",
      image: welcomeMan,
      icon: "",
    },
    {
      id: "birthday",
      title: "لوحة عيد ميلاد",
      image: welcomeBirthday,
      icon: "",
    },
    {
      id: "pregnant",
      title: "لوحة حامل",
      image: welcomePregnant,
      icon: "",
    },
    {
      id: "bride",
      title: "لوحة عروسة",
      image: welcomeBride,
      icon: "",
    },
    {
      id: "graduation",
      title: "لوحة تخرج",
      image: welcomeGraduation,
      icon: "",
    },
  ];

  const selectedWelcomeBoard =
    welcomeBoardTemplates.find((board) => board.id === selectedWelcomeBoardId) ||
    welcomeBoardTemplates[0];
const smallButtonStyle = {
  border: "1px solid #d8c5b3",
  background: "#ffffff",
  color: "#4b2e1f",
  borderRadius: "10px",
  width: "34px",
  minWidth: "34px",
  height: "34px",
  minHeight: "34px",
  padding: 0,
  margin: 0,
  cursor: "pointer",
  fontWeight: "800",
  fontSize: "12px",
  lineHeight: "1",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",
  boxShadow: "0 4px 10px rgba(75,46,31,0.08)",
};

const updateWelcomeTextPosition = (axis, direction) => {
  const step = 0.5;

  if (axis === "top") {
    const nextTop = Number(
      Math.min(70, Math.max(20, welcomeTextTop + direction * step)).toFixed(1)
    );
    setWelcomeTextTop(nextTop);
    localStorage.setItem("welcomeTextTop", String(nextTop));
    return;
  }

  const nextLeft = Number(
    Math.min(80, Math.max(20, welcomeTextLeft + direction * step)).toFixed(1)
  );
  setWelcomeTextLeft(nextLeft);
  localStorage.setItem("welcomeTextLeft", String(nextLeft));
};

const updateWelcomeFontWeight = (direction) => {
  const nextWeight = Math.min(900, Math.max(100, Number(welcomeFontWeight) + direction * 100));
  setWelcomeFontWeight(nextWeight);
  localStorage.setItem("welcomeFontWeight", String(nextWeight));
};

const toggleWelcomeFontBold = () => {
  const nextWeight = Number(welcomeFontWeight) >= 700 ? 400 : 700;
  setWelcomeFontWeight(nextWeight);
  localStorage.setItem("welcomeFontWeight", String(nextWeight));
};
const getSafeWelcomeBoardDimension = (value, fallbackValue) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : fallbackValue;
};

const currentWelcomeBoardPrintHeight = getSafeWelcomeBoardDimension(
  welcomeBoardPrintHeight,
  defaultWelcomeBoardPrintHeight
);
const currentWelcomeBoardPrintWidth = getSafeWelcomeBoardDimension(
  welcomeBoardPrintWidth,
  defaultWelcomeBoardPrintWidth
);

const updateWelcomeBoardPrintHeight = (value) => {
  setWelcomeBoardPrintHeight(value);
  localStorage.setItem("welcomeBoardPrintHeight", value);

  const numericHeight = Number(value);

  if (!Number.isFinite(numericHeight) || numericHeight <= 0) return;

  const nextWidth = String(Number((numericHeight * welcomeBoardAspectRatio).toFixed(2)));
  setWelcomeBoardPrintWidth(nextWidth);
  localStorage.setItem("welcomeBoardPrintWidth", nextWidth);
};

const updateWelcomeBoardPrintWidth = (value) => {
  setWelcomeBoardPrintWidth(value);
  localStorage.setItem("welcomeBoardPrintWidth", value);

  const numericWidth = Number(value);

  if (!Number.isFinite(numericWidth) || numericWidth <= 0) return;

  const nextHeight = String(Number((numericWidth / welcomeBoardAspectRatio).toFixed(2)));
  setWelcomeBoardPrintHeight(nextHeight);
  localStorage.setItem("welcomeBoardPrintHeight", nextHeight);
};

const selectedWelcomeFontData =
  welcomeBoardFonts.find((font) => font.id === selectedWelcomeFont) ||
  welcomeBoardFonts[0];

const welcomeBoardNameStyle = {
  position: "absolute",
  top: `${welcomeTextTop}%`,
  left: `${welcomeTextLeft}%`,
  transform: "translate(-50%, -50%)",
  width: "82%",
  textAlign: "center",
  color: "#5b3b2c",
  fontFamily: selectedWelcomeFontData.font,
  fontSize: `${welcomeFontSize}in`,
  lineHeight: "0.78in",
  fontWeight: Number(welcomeFontWeight),
  textShadow:
  Number(welcomeFontWeight) >= 800
    ? "0.35px 0 #5b3b2c, -0.35px 0 #5b3b2c, 0 0.35px #5b3b2c"
    : Number(welcomeFontWeight) >= 700
    ? "0.25px 0 #5b3b2c, -0.25px 0 #5b3b2c"
    : Number(welcomeFontWeight) >= 600
    ? "0.15px 0 #5b3b2c"
    : "none",
  fontSynthesis: "none",
  letterSpacing: "0.01em",
  whiteSpace: "nowrap",
  overflow: "visible",
  textOverflow: "clip",
};

  const renderWelcomeBoardCard = (board, previewMode = false) => (
    <div
      style={{
        width: `${currentWelcomeBoardPrintWidth}in`,
        height: `${currentWelcomeBoardPrintHeight}in`,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#ead8c9",
        boxShadow: previewMode ? "none" : "0 18px 38px rgba(75,46,31,0.18)",
        flexShrink: 0,
      }}
    >
      <img
        src={board.image}
        alt={board.title}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />

      {board.name && (
        <div style={welcomeBoardNameStyle}>
          {board.name}
        </div>
      )}
    </div>
  );

  const saveWelcomeBoard = () => {
    if (!welcomeBoardName.trim()) {
      alert("اكتب الاسم أولاً");
      return;
    }

    if (savedWelcomeBoards.length >= 2) {
      alert("الحد الأقصى للطباعة صورتين في ورقة A4 واحدة");
      return;
    }

    setSavedWelcomeBoards((prev) => [
      ...prev,
      {
        id: `${selectedWelcomeBoard.id}-${Date.now()}`,
        title: selectedWelcomeBoard.title,
        image: selectedWelcomeBoard.image,
        name: welcomeBoardName.trim(),
      },
    ]);

    setWelcomeBoardName("");
  };

  const removeSavedWelcomeBoard = (boardId) => {
    setSavedWelcomeBoards((prev) => prev.filter((board) => board.id !== boardId));
  };

  const clearSavedWelcomeBoards = () => {
    setSavedWelcomeBoards([]);
  };

  const printWelcomeBoards = () => {
    if (savedWelcomeBoards.length === 0) {
      alert("احفظ لوحة واحدة على الأقل قبل الطباعة");
      return;
    }

    const boardsToPrint = savedWelcomeBoards.slice(0, 2);
    const selectedFont =
      welcomeBoardFonts.find((font) => font.id === selectedWelcomeFont)?.font ||
      '"Riwaya29LTOnly"';

    const printWindow = window.open("", "_blank", "width=1200,height=800");

    if (!printWindow) {
      alert("المتصفح منع فتح صفحة الطباعة. اسمحي بالنوافذ المنبثقة وجربي مرة ثانية.");
      return;
    }

    const escapeHtml = (value) =>
      String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const boardHtml = boardsToPrint
      .map(
        (board) => `
          <div class="welcome-print-card">
            <img src="${board.image}" alt="${escapeHtml(board.title)}" />
            <div class="welcome-print-name">${escapeHtml(board.name)}</div>
          </div>
        `
      )
      .join("");

    printWindow.document.open();
    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=1123, initial-scale=1" />
          <title>Paradise Spa Welcome Boards</title>
          <style>
            @font-face {
              font-family: "Riwaya29LTOnly";
              src: url("/fonts/NeutonCursive-Regular.woff2") format("woff2"),
                   url("/fonts/NeutonCursive-Regular.otf") format("opentype");
              font-weight: 400 900;
              font-style: normal;
              font-display: swap;
            }

            @font-face {
              font-family: "LTRiwayaInformal";
              src: url("/fonts/LTRiwayaInformal.ttf") format("truetype"),
                   url("/fonts/LT-Riwaya-Informal.ttf") format("truetype");
              font-weight: 400 900;
              font-style: normal;
              font-display: swap;
            }

            @font-face {
              font-family: "CormorantUprightBold";
              src: url("/fonts/CormorantUpright-Bold.ttf") format("truetype"),
                   url("/fonts/CormorantUpright.ttf") format("truetype");
              font-weight: 700 900;
              font-style: normal;
              font-display: swap;
            }

            @font-face {
              font-family: "CormorantUpright";
              src: url("/fonts/CormorantUpright.ttf") format("truetype");
              font-weight: 400 900;
              font-style: normal;
              font-display: swap;
            }

            @font-face {
              font-family: "Diphylleia";
              src: url("/fonts/Diphylleia-Regular.ttf") format("truetype");
              font-weight: 400 900;
              font-style: normal;
              font-display: swap;
            }

            @font-face {
              font-family: "CormorantRegular";
              src: url("/fonts/Cormorant-Regular.ttf") format("truetype");
              font-weight: 400 900;
              font-style: normal;
              font-display: swap;
            }

            @font-face {
              font-family: "CormorantItalic";
              src: url("/fonts/Cormorant-Italic.ttf") format("truetype");
              font-weight: 400 900;
              font-style: normal;
              font-display: swap;
            }

            @page {
              size: 29.7cm 21cm landscape;
              margin: 0;
            }

            html,
            body {
              width: 29.7cm;
              height: 21cm;
              margin: 0;
              padding: 0;
              background: #ffffff;
            }

            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              font-synthesis: none;
            }

            .welcome-print-page {
              width: 29.7cm;
              height: 21cm;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 0.8cm;
              padding: 0.6cm;
              overflow: hidden;
              background: #ffffff;
            }

            .welcome-print-card {
              width: ${currentWelcomeBoardPrintWidth}in;
              height: ${currentWelcomeBoardPrintHeight}in;
              position: relative;
              overflow: hidden;
              flex: 0 0 auto;
              background: #ead8c9;
              break-inside: avoid;
              page-break-inside: avoid;
              box-shadow: none;
            }

            .welcome-print-card img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
            }

            .welcome-print-name {
              position: absolute;
              top: ${welcomeTextTop}%;
              left: ${welcomeTextLeft}%;
              transform: translate(-50%, -50%);
              width: 82%;
              text-align: center;
              color: #5b3b2c;
              font-family: ${selectedFont};
              font-size: ${welcomeFontSize}in;
              line-height: 0.86;
              font-weight: ${welcomeFontWeight};
              letter-spacing: 0.01em;
              white-space: nowrap;
              overflow: visible;
              text-overflow: clip;
            }
          </style>
        </head>
        <body>
          <div class="welcome-print-page">
            ${boardHtml}
          </div>
          <script>
            const images = Array.from(document.images);
            const imagePromises = images.map((image) => {
              if (image.complete) return Promise.resolve();
              return new Promise((resolve) => {
                image.onload = resolve;
                image.onerror = resolve;
              });
            });

            Promise.all([document.fonts.ready, ...imagePromises]).then(() => {
              setTimeout(() => {
                window.focus();
                window.print();
              }, 250);
            });
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const renderWelcomeBoardsPage = () => (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #fffaf3 0%, #e8ddd0 45%, #cdb9a7 100%)",
        padding: "26px",
        fontFamily: "Arial",
        color: "#4b2e1f",
      }}
    >
      <style>
        {`
          @font-face {
            font-family: "Riwaya29LTOnly";
            src: url("/fonts/NeutonCursive-Regular.woff2") format("woff2"),
                 url("/fonts/NeutonCursive-Regular.otf") format("opentype");
            font-weight: 400 900;
            font-style: normal;
            font-display: swap;
          }

          @font-face {
            font-family: "LTRiwayaInformal";
            src: url("/fonts/LTRiwayaInformal.ttf") format("truetype"),
                 url("/fonts/LT-Riwaya-Informal.ttf") format("truetype");
            font-weight: 400 900;
            font-style: normal;
            font-display: swap;
          }

          @font-face {
            font-family: "CormorantUprightBold";
            src: url("/fonts/CormorantUpright-Bold.ttf") format("truetype"),
                 url("/fonts/CormorantUpright.ttf") format("truetype");
            font-weight: 700 900;
            font-style: normal;
            font-display: swap;
          }

          @font-face {
            font-family: "CormorantRegular";
            src: url("/fonts/Cormorant-Regular.ttf") format("truetype");
            font-weight: 400 900;
            font-style: normal;
            font-display: swap;
          }

          @font-face {
            font-family: "CormorantUpright";
            src: url("/fonts/CormorantUpright.ttf") format("truetype");
            font-weight: 400 900;
            font-style: normal;
            font-display: swap;
          }

          @font-face {
            font-family: "CormorantItalic";
            src: url("/fonts/Cormorant-Italic.ttf") format("truetype");
            font-weight: 400 900;
            font-style: normal;
            font-display: swap;
          }

          @font-face {
            font-family: "Diphylleia";
            src: url("/fonts/Diphylleia-Regular.ttf") format("truetype");
            font-weight: 400 900;
            font-style: normal;
            font-display: swap;
          }

          #welcome-print-area {
            aspect-ratio: 297 / 210;
          }

          .welcome-board-print-card {
            font-synthesis: none;
            width: calc(3.7in * 0.5);
            height: calc(5.1in * 0.5);
            position: relative;
            overflow: visible;
            flex: 0 0 calc(3.7in * 0.5);
            background: #ead8c9;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .welcome-board-print-card > div {
            width: 3.7in !important;
            height: 5.1in !important;
            box-shadow: none !important;
            transform: scale(0.5);
            transform-origin: top left;
          }

          .welcome-board-print-card img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
          }

          @media print {
            body * {
              visibility: hidden !important;
            }

            #welcome-print-area,
            #welcome-print-area * {
              visibility: visible !important;
            }

            #welcome-print-area {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 29.7cm !important;
              height: 21cm !important;
              min-height: 21cm !important;
              margin: 0 !important;
              padding: 0 !important;
              box-shadow: none !important;
              background: white !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              gap: 1cm !important;
              box-sizing: border-box !important;
              overflow: hidden !important;
            }

            .welcome-board-print-card {
              width: 14.35cm !important;
              height: 19.78cm !important;
              flex: 0 0 14.35cm !important;
              box-shadow: none !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              transform: none !important;
              margin: 0 !important;
            }

            .no-print {
              display: none !important;
            }

            @page {
              size: A4 landscape;
              margin: 0;
            }
          }
        `}
      </style>

      <div
        className="no-print"
        style={{
          maxWidth: "1600px",
          margin: "0 auto",
        }}
      >
        <button
          onClick={() => setScreen("dashboard")}
          style={{
            ...buttonStyle,
            backgroundColor: "#fffaf3",
            color: "#4b2e1f",
            border: "1px solid #d6c7b8",
            marginBottom: "18px",
          }}
        >
          Back
        </button>

        <div
          style={{
            background: "rgba(255,255,255,0.74)",
            border: "1px solid rgba(255,255,255,0.75)",
            borderRadius: "34px",
            boxShadow: "0 26px 68px rgba(75,46,31,0.16)",
            padding: "26px",
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "24px",
            }}
          >
            <img
              src={logo}
              alt="logo"
              style={{
                width: "115px",
                marginBottom: "10px",
              }}
            />

            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "30px",
                color: "#4b2e1f",
              }}
            >
              طباعة اللوحة الترحيبية
            </h2>

            <p
              style={{
                margin: 0,
                color: "#8a7a68",
                fontSize: "14px",
                fontWeight: "700",
              }}
            >
             
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "260px 1fr 420px",
              gap: "22px",
              alignItems: "start",
            }}
          >
            <div
              style={{
                background: "linear-gradient(145deg, #fffaf3, #f1e4d8)",
                border: "1px solid #d8c5b3",
                borderRadius: "26px",
                padding: "16px",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.75)",
              }}
            >
              <h3
                style={{
                  margin: "0 0 14px",
                  fontSize: "18px",
                  textAlign: "center",
                  color: "#4b2e1f",
                }}
              >
                التصاميم
              </h3>

              <div style={{ display: "grid", gap: "10px" }}>
                {welcomeBoardTemplates.map((board) => {
                  const active = board.id === selectedWelcomeBoardId;

                  return (
                    <button
                      key={board.id}
                      onClick={() => setSelectedWelcomeBoardId(board.id)}
                      style={{
                        border: active ? "2px solid #4b2e1f" : "1px solid #d8c5b3",
                        background: active
                          ? "linear-gradient(135deg, #4b2e1f, #7a5a43)"
                          : "rgba(255,255,255,0.72)",
                        color: active ? "white" : "#4b2e1f",
                        borderRadius: "18px",
                        padding: "10px 12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        fontWeight: "800",
                        boxShadow: active
                          ? "0 12px 24px rgba(75,46,31,0.20)"
                          : "0 8px 18px rgba(75,46,31,0.06)",
                        transition: "0.2s",
                      }}
                    >
                      
                      <span>{board.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              style={{
                background: "linear-gradient(145deg, #fffaf3, #f6eee6)",
                border: "1px solid #d8c5b3",
                borderRadius: "30px",
                padding: "20px",
                textAlign: "center",
                boxShadow: "0 18px 42px rgba(75,46,31,0.10)",
              }}
            >
              <label
                style={{
                  display: "block",
                  color: "#4b2e1f",
                  fontWeight: "800",
                  marginBottom: "10px",
                }}
              >
                اسم الضيفة
              </label>

              <input
                value={welcomeBoardName}
                onChange={(event) => setWelcomeBoardName(event.target.value)}
                placeholder="اكتب الاسم هنا"
                style={{
                  width: "min(420px, 92%)",
                  padding: "14px 18px",
                  borderRadius: "18px",
                  border: "1px solid #d6c7b8",
                  background: "rgba(255,255,255,0.9)",
                  color: "#4b2e1f",
                  fontWeight: "800",
                  fontSize: "18px",
                  textAlign: "center",
                  outline: "none",
                  marginBottom: "18px",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "18px",
                }}
              >
                {renderWelcomeBoardCard({
                  ...selectedWelcomeBoard,
                  name: welcomeBoardName.trim(),
                })}
              </div>
<div
  style={{
    display: "grid",
    gridTemplateColumns: "180px repeat(9, 34px)",
    gap: "7px",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "14px",
  }}
>
  <select
    value={selectedWelcomeFont}
    onChange={(e) => {
      setSelectedWelcomeFont(e.target.value);
      localStorage.setItem("selectedWelcomeFont", e.target.value);
    }}
    style={{
      ...inputStyle,
      width: "180px",
      height: "34px",
      minHeight: "34px",
      padding: "0 10px",
      margin: 0,
      boxSizing: "border-box",
      fontSize: "12px",
      fontWeight: "800",
    }}
  >
    {welcomeBoardFonts.map((font) => (
      <option key={font.id} value={font.id}>
        {font.name}
      </option>
    ))}
  </select>

  <button
    type="button"
    title="تكبير النص"
    onClick={() => {
      const nextSize = Math.min(
        1.4,
        Number((welcomeFontSize + 0.04).toFixed(2))
      );

      setWelcomeFontSize(nextSize);
      localStorage.setItem("welcomeFontSize", String(nextSize));
    }}
    style={smallButtonStyle}
  >
    A+
  </button>

  <button
    type="button"
    title="تصغير النص"
    onClick={() => {
      const nextSize = Math.max(
        0.35,
        Number((welcomeFontSize - 0.04).toFixed(2))
      );

      setWelcomeFontSize(nextSize);
      localStorage.setItem("welcomeFontSize", String(nextSize));
    }}
    style={smallButtonStyle}
  >
    A-
  </button>

  <button
    type="button"
    title="تثقيل / تخفيف سريع"
    onClick={toggleWelcomeFontBold}
    style={{
      ...smallButtonStyle,
      fontWeight: "900",
      backgroundColor: Number(welcomeFontWeight) >= 700 ? "#4b2e1f" : "#fff",
      color: Number(welcomeFontWeight) >= 700 ? "#fff" : "#4b2e1f",
    }}
  >
    B
  </button>

  <button
    type="button"
    title="زيادة ثقل الخط"
    onClick={() => updateWelcomeFontWeight(1)}
    style={smallButtonStyle}
  >
    B+
  </button>

  <button
    type="button"
    title="تخفيف الخط"
    onClick={() => updateWelcomeFontWeight(-1)}
    style={smallButtonStyle}
  >
    B-
  </button>

  <button
    type="button"
    title="رفع النص"
    onClick={() => updateWelcomeTextPosition("top", -1)}
    style={smallButtonStyle}
  >
    ↑
  </button>

  <button
    type="button"
    title="تنزيل النص"
    onClick={() => updateWelcomeTextPosition("top", 1)}
    style={smallButtonStyle}
  >
    ↓
  </button>

  <button
    type="button"
    title="تحريك النص يسار"
    onClick={() => updateWelcomeTextPosition("left", -1)}
    style={smallButtonStyle}
  >
    ←
  </button>

  <button
    type="button"
    title="تحريك النص يمين"
    onClick={() => updateWelcomeTextPosition("left", 1)}
    style={smallButtonStyle}
  >
    →
  </button>
</div>

<div
  style={{
    display: "flex",
    gap: "14px",
    justifyContent: "center",
    alignItems: "flex-end",
    flexWrap: "wrap",
    marginBottom: "14px",
  }}
>
  <label
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "6px",
      fontWeight: "800",
      color: "#4b2e1f",
      fontSize: "13px",
      margin: 0,
    }}
  >
    طول الصورة
    <input
      type="number"
      step="0.1"
      min="1"
      value={welcomeBoardPrintHeight}
      onChange={(e) => updateWelcomeBoardPrintHeight(e.target.value)}
      style={{
        ...inputStyle,
        width: "90px",
        height: "42px",
        minHeight: "42px",
        padding: "0 8px",
        margin: 0,
        textAlign: "center",
        boxSizing: "border-box",
      }}
    />
  </label>

  <label
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "6px",
      fontWeight: "800",
      color: "#4b2e1f",
      fontSize: "13px",
      margin: 0,
    }}
  >
    عرض الصورة
    <input
      type="number"
      step="0.1"
      min="1"
      value={welcomeBoardPrintWidth}
      onChange={(e) => updateWelcomeBoardPrintWidth(e.target.value)}
      style={{
        ...inputStyle,
        width: "90px",
        height: "42px",
        minHeight: "42px",
        padding: "0 8px",
        margin: 0,
        textAlign: "center",
        boxSizing: "border-box",
      }}
    />
  </label>

  <span
    style={{
      color: "#8a7a68",
      fontSize: "10px",
      fontWeight: "700",
      paddingBottom: "14px",
    }}
  >
    inch
  </span>
</div>
              <button
                onClick={saveWelcomeBoard}
                style={{
                  ...buttonStyle,
                  background: "linear-gradient(135deg, #4b2e1f, #7a5a43)",
                  color: "white",
                  borderRadius: "18px",
                  minWidth: "180px",
                  boxShadow: "0 14px 28px rgba(75,46,31,0.18)",
                }}
              >
                حفظ اللوحة
              </button>
            </div>

            <div
              style={{
                background: "linear-gradient(145deg, #fffaf3, #f1e4d8)",
                border: "1px solid #d8c5b3",
                borderRadius: "30px",
                padding: "18px",
                boxShadow: "0 18px 42px rgba(75,46,31,0.10)",
              }}
            >
              <h3
                style={{
                  margin: "0 0 12px",
                  textAlign: "center",
                  color: "#4b2e1f",
                }}
              >
                معاينة الطباعة
              </h3>

              <div
                id="welcome-print-area"
                style={{
                  width: "100%",
                  aspectRatio: "297 / 210",
                  background: "white",
                  borderRadius: "18px",
                  border: "1px dashed #d8c5b3",
                  padding: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1cm",
                  overflow: "hidden",
                  boxSizing: "border-box",
                }}
              >
                {savedWelcomeBoards.length === 0 ? (
                  <div
                    style={{
                      color: "#8a7a68",
                      fontWeight: "800",
                      textAlign: "center",
                    }}
                  >
                    ستظهر اللوحات المحفوظة هنا
                  </div>
                ) : (
                  savedWelcomeBoards.map((board) => (
                    <div
                      key={board.id}
                      className="welcome-board-print-card"
                      style={{
                        position: "relative",
                      }}
                    >
                      {renderWelcomeBoardCard(board, true)}

                      <button
                        className="no-print"
                        onClick={() => removeSavedWelcomeBoard(board.id)}
                        style={{
                          position: "absolute",
                          top: "-10px",
                          left: "-10px",
                          border: "none",
                          background: "#9f3b32",
                          color: "white",
                          borderRadius: "50%",
                          width: "28px",
                          height: "28px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          boxShadow: "0 8px 18px rgba(159,59,50,0.25)",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                  marginTop: "16px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={printWelcomeBoards}
                  style={{
                    ...buttonStyle,
                    background: "linear-gradient(135deg, #4b2e1f, #7a5a43)",
                    color: "white",
                    borderRadius: "18px",
                    minWidth: "130px",
                  }}
                >
                  طباعة
                </button>

                <button
                  onClick={clearSavedWelcomeBoards}
                  style={{
                    ...buttonStyle,
                    background: "#f6eee6",
                    color: "#4b2e1f",
                    border: "1px solid #d8c5b3",
                    borderRadius: "18px",
                    minWidth: "130px",
                  }}
                >
                  مسح المعاينة
                </button>
              </div>

              <p
                style={{
                  color: "#8a7a68",
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: "700",
                  margin: "12px 0 0",
                }}
              >
                الحد الأقصى: صورتين في ورقة A4 واحدة
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );


  const unifiedOuterBackground = "linear-gradient(135deg, #ddd4c9 0%, #d2c7bb 45%, #c8baad 100%)";
  const unifiedPanelBackground = "linear-gradient(145deg, rgba(255,253,248,0.98), rgba(250,246,239,0.96))";
  const unifiedBorder = "1px solid rgba(255,255,255,0.78)";
  const unifiedShadow = "0 26px 64px rgba(75,46,31,0.12)";

  const globalLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setLoggedInUser("");
    setClientsSafely([]);
    setUsername("");
    setPassword("");
    localStorage.removeItem("paradise-is-logged-in");
    localStorage.removeItem("paradise-logged-in-user");
    setScreen("welcome");
  };

  const globalSearchBox = (compact = false) => (
    <div
      ref={dashboardSearchRef}
      style={{
        position: "relative",
        flex: compact ? "1 1 auto" : "1",
        minWidth: compact ? "320px" : "260px",
        maxWidth: compact ? "none" : "620px",
        background: "linear-gradient(145deg, rgba(255,250,243,0.98), rgba(243,232,223,0.93))",
        border: "1px solid rgba(214,199,184,0.95)",
        borderRadius: "22px",
        padding: compact ? "0 16px" : "12px 18px",
        height: compact ? "44px" : "auto",
        display: "flex",
        alignItems: "center",
        boxShadow: "0 16px 36px rgba(75,46,31,0.11)",
        pointerEvents: "auto",
        backdropFilter: "blur(12px)",
        zIndex: 999999,
      }}
    >
      <input
        placeholder="Search client..."
        value={dashboardSearch}
        onFocus={() => setShowDashboardSearchResults(true)}
        onChange={(e) => {
          setDashboardSearch(e.target.value);
          setShowDashboardSearchResults(true);
        }}
        style={{
          width: "100%",
          border: "none",
          outline: "none",
          background: "transparent",
          color: "#4b2e1f",
          fontSize: compact ? "13px" : "15px",
          fontWeight: "bold",
          textAlign: "center",
        }}
      />

      {showDashboardSearchResults && dashboardSearch && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            background: "rgba(255,255,255,0.99)",
            border: "1px solid rgba(214,199,184,0.95)",
            borderRadius: "18px",
            padding: "8px",
            boxShadow: "0 24px 56px rgba(75,46,31,0.20)",
            direction: "rtl",
            zIndex: 999999,
            maxHeight: "260px",
            overflowY: "auto",
          }}
        >
          {dashboardSearchResults.length === 0 ? (
            <div style={{ textAlign: "center", color: "#8a7a68", padding: "10px" }}>لا توجد نتائج</div>
          ) : (
            dashboardSearchResults.map((client) => (
              <button
                key={client.id}
                onClick={() => {
                  setShowDashboardSearchResults(false);
                  openClientProfile(client);
                }}
                style={{
                  ...buttonStyle,
                  width: "100%",
                  marginBottom: "6px",
                  backgroundColor: "rgba(255,255,255,0.94)",
                  color: "#4b2e1f",
                  border: "1px solid #eadfd5",
                  borderRadius: "15px",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  boxShadow: "0 8px 18px rgba(75,46,31,0.07)",
                }}
              >
                <span>{client.name}</span>
                <span>{client.phone}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );

  const withGreeting = (page) => {
    const showGlobalLayout =
      isLoggedIn &&
      screen !== "welcome" &&
      screen !== "menu";

    return (
      <>
        {showGlobalLayout && (
          <style>{`
            body { margin: 0; background: #ddd4c9; }
            @media (min-width: 1051px) {
              .paradise-global-page {
                min-height: 100vh !important;
                padding: 108px 28px 28px 270px !important;
                background: ${unifiedOuterBackground} !important;
                box-sizing: border-box !important;
                font-family: Arial !important;
              }
              .paradise-global-topbar {
                position: absolute !important;
                left: 270px !important;
                right: 28px !important;
                width: auto !important;
              }
              .paradise-unified-panel {
                width: 100% !important;
                min-height: calc(100vh - 134px) !important;
                background: ${unifiedPanelBackground} !important;
                border: ${unifiedBorder} !important;
                border-radius: 34px !important;
                box-shadow: ${unifiedShadow} !important;
                backdrop-filter: blur(14px) !important;
                padding: 26px !important;
                box-sizing: border-box !important;
                overflow: visible !important;
              }
              .paradise-unified-panel > div {
                min-height: auto !important;
                background: transparent !important;
                padding: 0 !important;
                margin: 0 !important;
                display: block !important;
                width: 100% !important;
                max-width: none !important;
                box-shadow: none !important;
                border: none !important;
              }
              .paradise-unified-panel > div > div {
                width: 100% !important;
                max-width: none !important;
                background: transparent !important;
                box-shadow: none !important;
                border: none !important;
                padding: 0 !important;
                margin: 0 auto !important;
              }
              .paradise-unified-panel input[placeholder="Search client..."] {
                max-width: 620px !important;
                width: 62% !important;
                min-width: 300px !important;
                background: #faf7f2 !important;
                border: 1px solid #d6c7b8 !important;
                color: #4b2e1f !important;
              }
              .paradise-unified-panel button {
                transition: 0.22s ease !important;
              }

            }
            @media (max-width: 1050px) {
              .paradise-global-sidebar {
  position: static !important;
  width: auto !important;
  margin: 14px !important;
  max-height: none !important;
}
              .paradise-global-logo {
  margin-top: 72px !important;
}
  .paradise-global-sidebar-buttons {
  display: grid !important;
  grid-template-columns: repeat(2, 1fr) !important;
  gap: 8px !important;
}

.paradise-global-sidebar-buttons button {
  margin-bottom: 0 !important;
}
              .paradise-global-page {
                padding: 30px 14px 14px !important;
                background: ${unifiedOuterBackground} !important;
                min-height: 100vh !important;
              }
              .paradise-global-topbar {
                position: absolute !important;
                left: 14px !important;
                right: 14px !important;
                top: 14px !important;
                width: auto !important;
                margin: 0 !important;
                flex-wrap: wrap !important;
                justify-content: center !important;
              }
              .paradise-unified-panel {
                background: ${unifiedPanelBackground} !important;
                border: ${unifiedBorder} !important;
                border-radius: 28px !important;
                box-shadow: ${unifiedShadow} !important;
                padding: 18px !important;
                box-sizing: border-box !important;
                overflow-x: hidden !important;
              }
              .paradise-unified-panel table {
                min-width: 760px !important;
              }
              .paradise-unified-panel input,
              .paradise-unified-panel select,
              .paradise-unified-panel textarea {
                max-width: 100% !important;
                box-sizing: border-box !important;
              }
              .paradise-unified-panel button {
                max-width: 100% !important;
                white-space: nowrap !important;
              }
              .paradise-unified-panel img {
                max-width: 100% !important;
              }
              .paradise-global-sidebar button {
                font-size: 12px !important;
                padding: 9px 8px !important;
              }
            }
            @media (max-width: 700px) {
              body {
                background: #d8c5b3 !important;
                -webkit-tap-highlight-color: transparent !important;
              }
              .paradise-global-page {
                padding: 88px 10px 92px !important;
                min-height: 100dvh !important;
                background: linear-gradient(180deg, #eee4d8 0%, #d8c5b3 100%) !important;
              }
              .paradise-global-topbar {
                top: 8px !important;
                left: 8px !important;
                right: 8px !important;
                border-radius: 22px !important;
                padding: 8px !important;
                gap: 7px !important;
                box-shadow: 0 12px 28px rgba(75,46,31,0.12) !important;
              }
              .paradise-global-topbar input {
                min-width: 150px !important;
                height: 40px !important;
                font-size: 13px !important;
              }
              .paradise-global-topbar > div {
                height: 38px !important;
                font-size: 12px !important;
                padding: 0 8px !important;
              }
              .paradise-global-sidebar {
                position: fixed !important;
                left: 8px !important;
                right: 8px !important;
                bottom: 8px !important;
                top: auto !important;
                width: auto !important;
                margin: 0 !important;
                display: flex !important;
                gap: 7px !important;
                overflow-x: auto !important;
                overflow-y: hidden !important;
                padding: 9px !important;
                border-radius: 24px !important;
                z-index: 9500 !important;
                max-height: 78px !important;
                background: rgba(255,250,243,0.94) !important;
                backdrop-filter: blur(16px) !important;
              }
              .paradise-global-logo {
                width: 42px !important;
                min-width: 42px !important;
                margin: 0 !important;
              }
              .paradise-global-sidebar button {
                min-width: 108px !important;
                height: 42px !important;
                margin: 0 !important;
                text-align: center !important;
                border-radius: 18px !important;
                font-size: 12px !important;
              }
              .paradise-unified-panel {
                border-radius: 26px !important;
                padding: 14px !important;
                min-height: calc(100dvh - 190px) !important;
                overflow: hidden !important;
              }
              .paradise-unified-panel > div,
              .paradise-unified-panel > div > div {
                border-radius: 24px !important;
              }
              .paradise-unified-panel h2 {
                font-size: 24px !important;
              }
              .paradise-unified-panel input,
              .paradise-unified-panel select,
              .paradise-unified-panel textarea {
                min-height: 40px !important;
                font-size: 14px !important;
              }
              .paradise-unified-panel button {
                min-height: 40px !important;
              }
              .paradise-unified-panel table {
                font-size: 13px !important;
              }
            }
          `}</style>
        )}

        {showGlobalLayout && (
          <aside
            className="paradise-global-sidebar"
            style={{
              position: "fixed",
              left: "18px",
              top: "18px",
              bottom: "18px",
              width: "190px",
              zIndex: 9000,
              background: "linear-gradient(145deg, rgba(255,250,243,0.91), rgba(243,232,223,0.82))",
              border: "1px solid rgba(255,255,255,0.78)",
              borderRadius: "30px",
              padding: "18px",
              boxShadow: "0 24px 60px rgba(46,31,23,0.20)",
              backdropFilter: "blur(14px)",
              direction: "rtl",
              overflowY: "auto",
            }}
          >
            <img
              className="paradise-global-logo"
              src={logo}
              alt="logo"
              onClick={() => setScreen("dashboard")}
              style={{
                width: "105px",
                display: "block",
                margin: "0 auto 20px",
                cursor: "pointer",
              }}
            />
<div className="paradise-global-sidebar-buttons">
            {dashboardServices.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setScreen(key)}
                onMouseEnter={(e) => luxuryHover(e, true)}
                onMouseLeave={(e) => luxuryHover(e, false)}
                style={{
                  ...buttonStyle,
                  width: "100%",
                  marginBottom: "9px",
                  textAlign: "right",
                  background:
                    screen === key
                      ? "linear-gradient(135deg, #3a2418, #7a5a43)"
                      : key === "finance" || key === "incomeExpenses"
                      ? "linear-gradient(135deg, #a58979, #8a6048)"
                      : "rgba(255,255,255,0.68)",
                  color: screen === key || key === "finance" || key === "incomeExpenses" ? "white" : "#4b2e1f",
                  border: "1px solid rgba(214,199,184,0.75)",
                  borderRadius: "18px",
                  transition: "0.25s ease",
                  boxShadow: "0 12px 30px rgba(75,46,31,0.10)",
                  fontSize: "13px",
                }}
              >
                {label}
              </button>
            ))}
            </div>
            <div
  style={{
    width: "100%",
    marginTop: "15px",
    padding: "14px",
    borderRadius: "18px",
    background: "#f7efe6",
    border: "1px solid #d6c7b8",
    textAlign: "center",
    boxSizing: "border-box",
  }}
>
  <div
    style={{
      fontWeight: "700",
      color: "#4b2e1f",
      fontSize: "15px",
      marginBottom: "8px",
    }}
  >
    {loggedInUser || "User"}
  </div>

  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "6px",
      color: "#4caf50",
      fontWeight: "600",
      fontSize: "13px",
    }}
  >
    <span
      style={{
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        background: "#4caf50",
        boxShadow: "0 0 10px #4caf50",
        display: "inline-block",
      }}
    />
    Online
  </div>
</div>
          </aside>
        )}
{showGlobalLayout && showGlobalClientForm && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(46,31,23,0.28)",
      zIndex: 99999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "18px",
      boxSizing: "border-box",
    }}
  >
    <div
      style={{
        background: "linear-gradient(145deg, #fffaf3, #f3e8df)",
        border: "1px solid rgba(214,199,184,0.95)",
        borderRadius: "28px",
        padding: "22px",
        width: "min(520px, 100%)",
        boxShadow: "0 28px 70px rgba(46,31,23,0.28)",
        direction: "ltr",
      }}
    >
      <h3
        style={{
          margin: "0 0 16px",
          color: "#4b2e1f",
          textAlign: "center",
          fontSize: "22px",
        }}
      >
        Add Client
      </h3>

      <input
        placeholder="Client Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
      />

      <input
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        onBlur={() => setPhone(formatSaudiPhoneForStorage(phone))}
        style={inputStyle}
      />

      <input
        placeholder="Address (Optional)"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={inputStyle}
      />

      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <button
          onClick={addClient}
          style={{
            ...buttonStyle,
            backgroundColor: "#4b2e1f",
            color: "white",
            width: "160px",
          }}
        >
          Save Client
        </button>

        <button
          onClick={() => setShowGlobalClientForm(false)}
          style={{
            ...buttonStyle,
            backgroundColor: "#faf7f2",
            color: "#4b2e1f",
            border: "1px solid #d6c7b8",
            width: "120px",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
        {showGlobalLayout && (
          <div
            className="paradise-global-topbar"
            style={{
              position: "absolute",
              top: "18px",
              zIndex: 8999,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "12px",
              pointerEvents: "none",
              background: "linear-gradient(145deg, rgba(255,253,248,0.96), rgba(247,241,233,0.94))",
              border: "1px solid rgba(255,255,255,0.84)",
              borderRadius: "28px",
              padding: "10px",
              boxShadow: "0 18px 42px rgba(75,46,31,0.12)",
              backdropFilter: "blur(14px)",
              boxSizing: "border-box",
            }}
          >
            {globalSearchBox(true)}
<button
  onClick={() => setShowGlobalClientForm(true)}
  style={{
    ...buttonStyle,
    height: "44px",
    minWidth: "150px",
    padding: "0 18px",
    margin: 0,
    background: "linear-gradient(135deg, #fffaf3, #f3e8df)",
    color: "#4b2e1f",
    border: "1px solid rgba(214,199,184,0.95)",
    borderRadius: "20px",
    boxShadow: "0 12px 28px rgba(75,46,31,0.10)",
    fontSize: "14px",
    fontWeight: "900",
    pointerEvents: "auto",
    whiteSpace: "nowrap",
  }}
>
  + Add Client
</button>
            <div
              style={{
                background: "linear-gradient(135deg, #fffaf3, #f3e8df)",
                border: "1px solid rgba(214,199,184,0.95)",
                borderRadius: "20px",
                padding: "0 14px",
                height: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 12px 28px rgba(75,46,31,0.10)",
                color: "#6f6259",
                fontWeight: "800",
                textAlign: "center",
                pointerEvents: "auto",
                whiteSpace: "nowrap",
              }}
            >
              {formatShortArabicDate(todayDate)}
            </div>

            <div
              style={{
                background: "linear-gradient(135deg, #fffaf3, #f3e8df)",
                border: "1px solid rgba(214,199,184,0.95)",
                borderRadius: "20px",
                padding: "0 11px",
                height: "44px",
                boxShadow: "0 12px 28px rgba(75,46,31,0.10)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                direction: "rtl",
                pointerEvents: "auto",
                whiteSpace: "nowrap",
              }}
            >
              <strong style={{ fontSize: "15px", letterSpacing: "0.2px", fontWeight: "900", color: "#3f2a1f" }}>مرحبا {loggedInUser}</strong>
              <button
                onClick={globalLogout}
                style={{
                  ...buttonStyle,
                  background: "linear-gradient(135deg, #4b2e1f, #7a5a43)",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "999px",
                  fontSize: "12px",
                }}
              >
                تسجيل خروج
              </button>
            </div>
          </div>
        )}

        <div className="paradise-global-page">
          {showGlobalLayout ? (
            <main className="paradise-unified-panel">{page}</main>
          ) : (
            page
          )}
        </div>
      </>
    );
  };


if (!isLoggedIn) {
  return (
    <div style={luxuryPageStyle}>
      <div
        style={{
          ...luxuryCardStyle,
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.92), rgba(250,247,242,0.74))",
          boxShadow: "0 34px 90px rgba(75,46,31,0.24)",
          border: "1px solid rgba(255,255,255,0.9)",
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{
            width: "150px",
            marginBottom: "18px",
          }}
        />



        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={async () => {
            const email = createLoginEmail(username);

            if (!email || !password) {
              alert("Username أو Password غير صحيح");
              return;
            }

            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (error || !data?.session?.user?.email) {
              alert("Username أو Password غير صحيح");
              return;
            }

            setLoggedInUser(getDisplayNameFromEmail(data.session.user.email) || "مستخدم");
            setIsLoggedIn(true);
            setAuthReady(true);
            // التحميل يتم من useEffect مرة واحدة بعد تسجيل الدخول لتجنب سحب البيانات مرتين.
          }}
          style={{
            ...buttonStyle,
            width: "90%",
            background: "linear-gradient(135deg, #3a2116, #8b654d)",
            color: "white",
            fontSize: "16px",
            padding: "15px",
            
            marginTop: "45px",
            boxShadow: "0 16px 34px rgba(75,46,31,0.22)",
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}
  if (screen === "welcome") {
    return withGreeting(
      <div style={luxuryPageStyle}>
        <div style={luxuryCardStyle}>
          <img
            src={logo}
            alt="logo"
            style={{
              width: "185px",
              marginTop: "35px",
              marginBottom: "45px",
            }}
          />

          <h1
            style={{
              color: "#4b2e1f",
              fontSize: "30px",
              marginBottom: "8px",
              letterSpacing: "1px",
            }}
          >

          </h1>

          <p
            style={{
              color: "#8a7a68",
              fontSize: "15px",
              marginBottom: "45px",
            }}
          >
          </p>

          <button
            onClick={() => {
              setScreen("dashboard");
            }}
            style={{
              ...buttonStyle,
              width: "78%",
              padding: "16px 22px",
              background:
                "linear-gradient(to right, #4b2e1f, #7a5a43)",
              color: "white",
              fontSize: "18px",
              borderRadius: "18px",
              boxShadow: "0 12px 24px rgba(75,46,31,0.22)",
            }}
          >
            Welcome To Paradise Spa
          </button>
        </div>
      </div>
    );
  }

  if (screen === "menu") {
    return withGreeting(
      <div style={luxuryPageStyle}>
        <div style={luxuryCardStyle}>
          <img
            src={logo}
            alt="logo"
            style={{
              width: "135px",
              marginBottom: "25px",
            }}
          />

          <h2
            style={{
              color: "#4b2e1f",
              fontSize: "26px",
              marginBottom: "35px",
            }}
          >
            اختر الخدمة
          </h2>

          <button
            onClick={() => setScreen("appointments")}
            style={{
              ...buttonStyle,
              width: "85%",
              padding: "17px 22px",
              backgroundColor: "#faf7f2",
              color: "#4b2e1f",
              fontSize: "17px",
              marginBottom: "16px",
              borderRadius: "18px",
              border: "1px solid #d6c7b8",
            }}
          >
            جدول المواعيد
          </button>

          <button
            onClick={() => setScreen("loyalty")}
            style={{
              ...buttonStyle,
              width: "85%",
              padding: "17px 22px",
              backgroundColor: "#4b2e1f",
              color: "white",
              fontSize: "17px",
              marginBottom: "16px",
              borderRadius: "18px",
              boxShadow: "0 10px 22px rgba(75,46,31,0.18)",
            }}
          >
            كروت الولاء
          </button>

          <button
            onClick={() => setScreen("clients")}
            style={{
              ...buttonStyle,
              width: "85%",
              padding: "17px 22px",
              backgroundColor: "#faf7f2",
              color: "#4b2e1f",
              fontSize: "17px",
              marginBottom: "16px",
              borderRadius: "18px",
              border: "1px solid #d6c7b8",
            }}
          >
            عملائنا
          </button>

          <button
            onClick={() => setScreen("referrals")}
            style={{
              ...buttonStyle,
              width: "85%",
              padding: "17px 22px",
              backgroundColor: "#4b2e1f",
              color: "#ffffff",
              fontSize: "17px",
              marginBottom: "16px",
              borderRadius: "18px",
              border: "1px solid #d6c7b8",
            }}
          >
            العملاء المرشحين
          </button>

          <button
            onClick={() => setScreen("finance")}
            style={{
              ...buttonStyle,
              width: "85%",
              padding: "17px 22px",
              backgroundColor: "#6b4630",
              color: "white",
              fontSize: "17px",
              marginBottom: "16px",
              borderRadius: "18px",
              border: "1px solid #d6c7b8",
            }}
          >
            التقارير
          </button>

          <button
            onClick={() => setScreen("incomeExpenses")}
            style={{
              ...buttonStyle,
              width: "85%",
              padding: "17px 22px",
              backgroundColor: "#faf7f2",
              color: "#4b2e1f",
              fontSize: "17px",
              borderRadius: "18px",
              border: "1px solid #d6c7b8",
            }}
          >
            الدخل والمصاريف
          </button>
          
        </div>
      </div>
    );
  }

  if (screen === "dashboard") {
    const appointmentSections = [
      {
        title: `مواعيد اليوم ${formatNumericDate(todayDate)}`,
        empty: "لا توجد مواعيد اليوم",
        date: todayDate,
        reminder: false,
        items: todayAppointments,
      },
      {
        title: `مواعيد يوم ${formatNumericDate(tomorrowDate)}`,
        empty: "لا توجد مواعيد لهذا اليوم",
        date: tomorrowDate,
        reminder: true,
        items: tomorrowAppointments,
      },
      {
        title: `مواعيد يوم ${formatNumericDate(dayAfterTomorrowDate)}`,
        empty: "لا توجد مواعيد لهذا اليوم",
        date: dayAfterTomorrowDate,
        reminder: true,
        items: dayAfterTomorrowAppointments,
      },
    ];

    return withGreeting(
      <div
        style={{
          width: "100%",
          color: "#4b2e1f",
          fontFamily: "Arial",
          boxSizing: "border-box",
        }}
      >
        <style>{`
          @media (max-width: 1050px) {
            .paradise-dashboard-appointments { grid-template-columns: 1fr !important; }
          }
        `}</style>

        <div
          style={{
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          <img src={logo} alt="logo" style={{ width: "105px", marginBottom: "12px" }} />
          <h2 style={{ margin: 25, fontSize: "28px", color: "#4b2e1f" }}>المواعيد</h2>
        </div>

        <div
          className="paradise-dashboard-appointments"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(240px, 1fr))",
            gap: "18px",
          }}
        >
          {appointmentSections.map((section) => (
            <section
              key={section.date}
              style={{
                background: "rgba(255,255,255,0.72)",
                border: "1px solid rgba(255,255,255,0.85)",
                borderRadius: "32px",
                padding: "18px",
                minHeight: "560px",
                boxShadow: "0 24px 60px rgba(75,46,31,0.12)",
                backdropFilter: "blur(14px)",
                minWidth: 0,
              }}
            >
              <h2 style={{ margin: "0 0 16px", textAlign: "center", fontSize: "20px" }}>
                {section.title}
              </h2>
              {section.items.length === 0 ? (
                <div style={{ textAlign: "center", color: "#8a7a68", padding: "30px" }}>
                  {section.empty}
                </div>
              ) : (
                section.items.map((appointment) => appointmentCard(appointment, section.date, section.reminder))
              )}
            </section>
          ))}
        </div>
      </div>
    );
  }

  if (screen === "appointments") {
    return withGreeting(
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(to bottom right, #f6f1ea, #ebe1d3)",
          padding: "24px",
          fontFamily: "Arial",
        }}
      >
        <div
          style={{
            maxWidth: "1600px",
            margin: "0 auto",
            backgroundColor: "white",
            borderRadius: "30px",
            padding: "24px",
            boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
            position: "relative",
          }}
        >
          <button
            onClick={() => setScreen("dashboard")}
            style={{
              position: "absolute",
              top: "18px",
              left: "18px",
              ...buttonStyle,
              backgroundColor: "#faf7f2",
              color: "#4b2e1f",
              padding: "8px 16px",
              border: "1px solid #d6c7b8",
              borderRadius: "16px",
              fontSize: "13px",
            }}
          >
            Back
          </button>

          <div style={{ textAlign: "center", marginBottom: "18px" }}>
            <img
              src={logo}
              alt="logo"
              style={{
                width: "105px",
                marginBottom: "10px",
              }}
            />

            <h2
              style={{
                color: "#4b2e1f",
                margin: "0 0 8px",
                fontSize: "28px",
              }}
            >
              جدول المواعيد
            </h2>

            <div
              style={{
                color: "#8a7a68",
                fontWeight: "bold",
                marginBottom: "14px",
              }}
            >
              {formatAppointmentDate(selectedScheduleDate)}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => changeScheduleDateByDays(-1)}
                style={{
                  ...buttonStyle,
                  background: "linear-gradient(135deg, #4b2e1f, #7a5a43)",
                  color: "white",
                  borderRadius: "16px",
                  padding: "10px 14px",
                }}
              >
                اليوم السابق
              </button>

              <input
                type="date"
                value={selectedScheduleDate}
                max={`${new Date().getFullYear() + 5}-12-31`}
                onChange={(e) => setSelectedScheduleDate(e.target.value)}
                style={{
                  padding: "12px 16px",
                  borderRadius: "16px",
                  border: "1px solid #d6c7b8",
                  backgroundColor: "#faf7f2",
                  color: "#4b2e1f",
                  outline: "none",
                  fontWeight: "bold",
                  boxShadow: "0 10px 24px rgba(75,46,31,0.08)",
                }}
              />

              <button
                onClick={() => changeScheduleDateByDays(1)}
                style={{
                  ...buttonStyle,
                  background: "linear-gradient(135deg, #d8c5b3, #f3e8df)",
                  color: "#4b2e1f",
                  border: "1px solid #d6c7b8",
                  borderRadius: "16px",
                  padding: "10px 14px",
                }}
              >
                اليوم التالي
              </button>

              <button
                onClick={() => setSelectedScheduleDate(todayDate)}
                style={{
                  ...buttonStyle,
                  background: "#fffaf3",
                  color: "#4b2e1f",
                  border: "1px solid #d6c7b8",
                  borderRadius: "16px",
                  padding: "10px 14px",
                }}
              >
                اليوم
              </button>
            </div>
          </div>

          <datalist id="clientByList">
            {clientByOptions.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>

          <datalist id="therapistList">
            {therapistOptions.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>

          <datalist id="serviceList">
            {serviceOptions.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>

          <datalist id="orderList">
            {orderOptions.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: "12px",
              padding: "10px",
              borderRadius: "18px",
              background: "linear-gradient(135deg, #fffaf3, #f2e7da)",
              border: "1px solid rgba(214,199,184,0.85)",
              boxShadow: "0 10px 24px rgba(75,46,31,0.06)",
            }}
          >
            <strong style={{ color: "#4b2e1f" }}>Fill Color</strong>
            <select
              onChange={(e) => applyScheduleCellFormatting("fillColor", e.target.value)}
              defaultValue=""
              style={{
                ...scheduleSummaryInputStyle,
                width: "125px",
                padding: "6px",
              }}
            >
              {scheduleFillColors.map(([value, label]) => (
                <option key={label} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <strong style={{ color: "#4b2e1f" }}>حجم الخط</strong>
            <select
              value={scheduleSettings.defaultFontSize || "14"}
              onChange={(e) => updateScheduleDefaultFontSize(e.target.value)}
              style={{
                ...scheduleSummaryInputStyle,
                width: "80px",
                padding: "6px",
              }}
            >
              {scheduleFontSizes.map((fontSize) => (
                <option key={fontSize} value={fontSize}>
                  {fontSize}
                </option>
              ))}
            </select>

            
          </div>

          <div style={scheduleTableWrapperStyle}>
            <table
              style={{
                minWidth: "max-content",
                width: "max-content",
                borderCollapse: "collapse",
                borderSpacing: 0,
                color: "#4b2e1f",
                fontSize: "13px",
                textAlign: "center",
              }}
            >
              <colgroup>
                {scheduleColumns.map((column) => (
                  <col
                    key={column.field}
                    style={{ width: `${getScheduleColumnWidth(column.field)}px` }}
                  />
                ))}
              </colgroup>

              <thead>
                <tr
                  style={{
                    background: "linear-gradient(135deg, #d8c5b3, #efe5d9)",
                    color: "#4b2e1f",
                  }}
                >
                  {scheduleColumns.map((column) => (
                    <th
                      key={column.field}
                      style={{
                        ...scheduleHeaderCellStyle,
                        width: `${getScheduleColumnWidth(column.field)}px`,
                        minWidth: `${getScheduleColumnWidth(column.field)}px`,
                        maxWidth: `${getScheduleColumnWidth(column.field)}px`,
                        position: "sticky",
                      }}
                    >
                      <span>{column.label}</span>
                      <span
                        onMouseDown={(event) => startScheduleColumnResize(event, column.field)}
                        title="تغيير عرض الخانة"
                        style={{
                          position: "absolute",
                          top: 0,
                          right: "-3px",
                          width: "7px",
                          height: "100%",
                          cursor: "col-resize",
                          zIndex: 5,
                        }}
                      />
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {appointmentStats.rows.map((row, index) => (
                  <tr
                    key={`${selectedScheduleDate}-${index}`}
                    style={getScheduleRowStyle(row, index)}
                  >
                    <td
                      style={getScheduleCellStyle(index, "status")}
                      {...getScheduleCellHandlers(index, "status")}
                    >
                      <select
                        value={row.status}
                        onChange={(e) =>
                          updateScheduleRow(index, "status", e.target.value)
                        }
                        {...getScheduleEditableProps(index, "status")}
                        style={getScheduleInputStyle(index, "status")}
                      >
                        {appointmentStatuses.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td
                      style={getScheduleCellStyle(index, "clientBy")}
                      {...getScheduleCellHandlers(index, "clientBy")}
                    >
                      <input
                        list="clientByList"
                        value={row.clientBy}
                        onChange={(e) =>
                          updateScheduleRow(index, "clientBy", e.target.value)
                        }
                        {...getScheduleEditableProps(index, "clientBy")}
                        style={getScheduleInputStyle(index, "clientBy")}
                      />
                    </td>

                    <td
                      style={getScheduleCellStyle(index, "serviceTime", { whiteSpace: "nowrap" })}
                      {...getScheduleCellHandlers(index, "serviceTime")}
                    >
                      <input
                        value={row.serviceTime}
                        onChange={(e) =>
                          updateScheduleRow(index, "serviceTime", e.target.value)
                        }
                        {...getScheduleEditableProps(index, "serviceTime")}
                        style={getScheduleInputStyle(index, "serviceTime", { fontWeight: "bold" })}
                      />
                    </td>

                    <td
                      style={getScheduleCellStyle(index, "driver")}
                      {...getScheduleCellHandlers(index, "driver")}
                    >
                      <input
                        value={row.driver}
                        onChange={(e) =>
                          updateScheduleRow(index, "driver", e.target.value)
                        }
                        {...getScheduleEditableProps(index, "driver")}
                        style={getScheduleInputStyle(index, "driver")}
                      />
                    </td>

                    <td
                      style={getScheduleCellStyle(index, "therapist")}
                      {...getScheduleCellHandlers(index, "therapist")}
                    >
                      <input
                        list="therapistList"
                        value={row.therapist}
                        onChange={(e) =>
                          updateScheduleRow(index, "therapist", e.target.value)
                        }
                        {...getScheduleEditableProps(index, "therapist")}
                        style={getScheduleInputStyle(index, "therapist")}
                      />
                    </td>

                    <td
                      style={getScheduleCellStyle(index, "district")}
                      {...getScheduleCellHandlers(index, "district")}
                    >
                      <input
                        value={row.district}
                        onChange={(e) =>
                          updateScheduleRow(index, "district", e.target.value)
                        }
                        {...getScheduleEditableProps(index, "district")}
                        style={getScheduleInputStyle(index, "district")}
                      />
                    </td>

                    <td
                      style={getScheduleCellStyle(index, "client")}
                      {...getScheduleCellHandlers(index, "client")}
                    >
                      <input
                        value={row.client}
                        onChange={(e) =>
                          updateScheduleRow(index, "client", e.target.value)
                        }
                        {...getScheduleEditableProps(index, "client")}
                        style={getScheduleInputStyle(index, "client")}
                      />
                    </td>

                    <td
                      style={getScheduleCellStyle(index, "frame", { textAlign: "center" })}
                      {...getScheduleCellHandlers(index, "frame")}
                    >
                      <input
                        type="checkbox"
                        checked={!!row.frame}
                        onChange={(e) =>
                          updateScheduleRow(index, "frame", e.target.checked)
                        }
                        {...getScheduleEditableProps(index, "frame")}
                        style={{
                          width: "14px",
                          height: "14px",
                          margin: 0,
                          cursor: "pointer",
                        }}
                      />
                    </td>

                    <td
                      style={getScheduleCellStyle(index, "order")}
                      {...getScheduleCellHandlers(index, "order")}
                    >
                      <input
                        list="orderList"
                        value={row.order}
                        onChange={(e) =>
                          updateScheduleRow(index, "order", e.target.value)
                        }
                        {...getScheduleEditableProps(index, "order")}
                        style={getScheduleInputStyle(index, "order")}
                      />
                    </td>

                    <td
                      style={getScheduleCellStyle(index, "services")}
                      {...getScheduleCellHandlers(index, "services")}
                    >
                      <input
                        list="serviceList"
                        value={row.services}
                        onChange={(e) =>
                          updateScheduleRow(index, "services", e.target.value)
                        }
                        {...getScheduleEditableProps(index, "services")}
                        style={getScheduleInputStyle(index, "services")}
                      />
                    </td>

                    <td
                      style={getScheduleCellStyle(index, "number")}
                      {...getScheduleCellHandlers(index, "number")}
                    >
                      <input
                        value={row.number}
                        onChange={(e) =>
                          updateScheduleRow(index, "number", e.target.value)
                        }
                        onBlur={(e) => applyScheduleNumberLookup(index, e.target.value)}
                        {...getScheduleEditableProps(index, "number")}
                        style={getScheduleInputStyle(index, "number")}
                      />
                    </td>

                    <td
                      style={getScheduleCellStyle(index, "transportation")}
                      {...getScheduleCellHandlers(index, "transportation")}
                    >
                      <input
                        value={row.transportation}
                        onChange={(e) =>
                          updateScheduleRow(index, "transportation", e.target.value)
                        }
                        {...getScheduleEditableProps(index, "transportation")}
                        style={getScheduleInputStyle(index, "transportation")}
                      />
                    </td>

                    <td
                      style={getScheduleCellStyle(index, "serviceAmount")}
                      {...getScheduleCellHandlers(index, "serviceAmount")}
                    >
                      <input
                        value={row.serviceAmount}
                        onChange={(e) =>
                          updateScheduleRow(index, "serviceAmount", e.target.value)
                        }
                        {...getScheduleEditableProps(index, "serviceAmount")}
                        style={getScheduleInputStyle(index, "serviceAmount")}
                      />
                    </td>

                    <td
                      style={getScheduleCellStyle(index, "totalPrice", {
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#111",
                      })}
                    >
                      {formatCurrency(parseAmount(row.serviceAmount) + parseAmount(row.transportation))}
                    </td>

                    <td
                      style={getScheduleCellStyle(index, "paymentMethod")}
                      {...getScheduleCellHandlers(index, "paymentMethod")}
                    >
                      <select
                        value={row.paymentMethod}
                        onChange={(e) =>
                          updateScheduleRow(index, "paymentMethod", e.target.value)
                        }
                        {...getScheduleEditableProps(index, "paymentMethod")}
                        style={getScheduleInputStyle(index, "paymentMethod")}
                      >
                        {paymentOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td
                      style={getScheduleCellStyle(index, "cashReceivedBy")}
                      {...getScheduleCellHandlers(index, "cashReceivedBy")}
                    >
                      <input
                        value={row.cashReceivedBy}
                        onChange={(e) =>
                          updateScheduleRow(index, "cashReceivedBy", e.target.value)
                        }
                        {...getScheduleEditableProps(index, "cashReceivedBy")}
                        style={getScheduleInputStyle(index, "cashReceivedBy")}
                      />
                    </td>

                    <td
                      style={getScheduleCellStyle(index, "sendTo")}
                      {...getScheduleCellHandlers(index, "sendTo")}
                    >
                      <select
                        value={row.sendTo || ""}
                        onChange={(e) =>
                          updateScheduleRow(index, "sendTo", e.target.value)
                        }
                        {...getScheduleEditableProps(index, "sendTo")}
                        style={getScheduleInputStyle(index, "sendTo")}
                      >
                        {sendToOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td
                      style={getScheduleCellStyle(index, "note")}
                      {...getScheduleCellHandlers(index, "note")}
                    >
                      <input
                        value={row.note}
                        onChange={(e) =>
                          updateScheduleRow(index, "note", e.target.value)
                        }
                        {...getScheduleEditableProps(index, "note")}
                        style={getScheduleInputStyle(index, "note")}
                      />
                    </td>

                    <td
                      style={getScheduleCellStyle(index, "giftFrom")}
                      {...getScheduleCellHandlers(index, "giftFrom")}
                    >
                      <input
                        value={row.giftFrom || ""}
                        onChange={(e) =>
                          updateScheduleRow(index, "giftFrom", e.target.value)
                        }
                        {...getScheduleEditableProps(index, "giftFrom")}
                        style={getScheduleInputStyle(index, "giftFrom")}
                      />
                    </td>

                    <td
                      style={getScheduleCellStyle(index, "giftPhone")}
                      {...getScheduleCellHandlers(index, "giftPhone")}
                    >
                      <input
                        value={row.giftPhone || ""}
                        onChange={(e) =>
                          updateScheduleRow(index, "giftPhone", e.target.value)
                        }
                        onBlur={(e) =>
                          updateScheduleRow(
                            index,
                            "giftPhone",
                            formatSaudiPhoneForStorage(e.target.value)
                          )
                        }
                        {...getScheduleEditableProps(index, "giftPhone")}
                        style={getScheduleInputStyle(index, "giftPhone")}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "18px",
              marginTop: "-4px",
            }}
          >
            <div style={scheduleSummaryCardStyle}>
              <h3 style={scheduleSummaryHeaderStyle}>
                Payment Method
              </h3>
              {Object.entries(appointmentStats.paymentTotals).map(([key, value]) => (
                <div key={key} style={scheduleSummaryRowStyle}>
                  <strong>{key}</strong>
                  <span>{formatCurrency(value)}</span>
                </div>
              ))}
              <div style={scheduleSummaryRowStyle}>
                <strong>Total</strong>
                <strong>{formatCurrency(appointmentStats.totalIncome)}</strong>
              </div>
            </div>

            <div style={scheduleSummaryCardStyle}>
              <h3 style={scheduleSummaryHeaderStyle}>
                Services
              </h3>
              {[
                ["serviceMassage", "Massage"],
                ["serviceManiPedi", "Mani & Pedi"],
                ["serviceMoroccanBath", "Moroccan Bath"],
                ["servicePackage", "Package"],
              ].map(([field, label]) => (
                <div key={field} style={scheduleSummaryRowStyle}>
                  <strong>{label}</strong>
                  <input
                    value={appointmentStats.manual[field]}
                    onChange={(e) => updateManualForDate(field, e.target.value)}
                    style={scheduleSummaryInputStyle}
                  />
                </div>
              ))}
              <div style={scheduleSummaryRowStyle}>
                <strong>Total Services</strong>
                <strong>{appointmentStats.totalServices}</strong>
              </div>
            </div>

            <div style={scheduleSummaryCardStyle}>
              <h3 style={scheduleSummaryHeaderStyle}>
                Clients & Gifts
              </h3>
              {[
                ["New Clients", appointmentStats.newClients],
                ["Loyal Clients", appointmentStats.loyalClients],
                ["Gifts Added", appointmentStats.giftsAdded],
                ["Gifts Received", appointmentStats.giftsReceived],
                ["Free", appointmentStats.freeGifts],
                ["2 Free", appointmentStats.twoFreeGifts],
                ["Avg Services Price", formatCurrency(appointmentStats.averageServicePrice)],
              ].map(([key, value]) => (
                <div key={key} style={scheduleSummaryRowStyle}>
                  <strong>{key}</strong>
                  <span>{formatCurrency(value)}</span>
                </div>
              ))}
              <div style={scheduleSummaryRowStyle}>
                <strong>Clients Turned Away</strong>
                <input
                  value={appointmentStats.manual.clientsTurnedAway}
                  onChange={(e) => updateManualForDate("clientsTurnedAway", e.target.value)}
                  style={scheduleSummaryInputStyle}
                />
              </div>
            </div>

            <div style={scheduleSummaryCardStyle}>
              <h3 style={scheduleSummaryHeaderStyle}>
                Daily Collection
              </h3>
              <div style={scheduleSummaryRowStyle}>
                <strong>Total Income</strong>
                <span>{formatCurrency(appointmentStats.totalIncome)}</span>
              </div>
              {[
                ["naft", "Naft"],
                ["uber", "Uber"],
                ["purchase", "Purchase"],
                ["staffSalary", "Staff Salary"],
                ["houseRent", "House Rent"],
                ["carRent", "Car Rent"],
                ["governmentFees", "Government Fees"],
              ].map(([field, label]) => (
                <div key={field} style={scheduleSummaryRowStyle}>
                  <strong>{label}</strong>
                  <input
                    value={appointmentStats.manual[field]}
                    onChange={(e) => updateManualForDate(field, e.target.value)}
                    style={scheduleSummaryInputStyle}
                  />
                </div>
              ))}
              <div style={scheduleSummaryRowStyle}>
                <strong>Commission</strong>
                <strong>{formatCurrency(appointmentStats.totalCommission)}</strong>
              </div>
              <div style={scheduleSummaryRowStyle}>
                <strong>Daily Cost</strong>
                <strong>{formatCurrency(appointmentStats.dailyCost)}</strong>
              </div>
              <div style={scheduleSummaryRowStyle}>
                <strong>Net Profit</strong>
                <strong>{formatCurrency(appointmentStats.netProfit)}</strong>
              </div>
              <div style={scheduleSummaryRowStyle}>
                <strong>Total Transportation</strong>
                <strong>{formatCurrency(appointmentStats.totalTransportation)}</strong>
              </div>
            </div>

            <div style={scheduleSummaryCardStyle}>
              <h3 style={scheduleSummaryHeaderStyle}>
                Commission
              </h3>
              {[
                ["commissionJoce", "Joce"],
                ["commissionCaren", "Caren"],
              ].map(([field, label]) => (
                <div key={field} style={scheduleSummaryRowStyle}>
                  <strong>{label}</strong>
                  <input
                    value={appointmentStats.manual[field]}
                    onChange={(e) => updateManualForDate(field, e.target.value)}
                    style={scheduleSummaryInputStyle}
                  />
                </div>
              ))}
            </div>

            <div style={scheduleSummaryCardStyle}>
              <h3 style={scheduleSummaryHeaderStyle}>
                Availability
              </h3>
              {therapistOptions.map((name) => (
                <div key={name} style={{
                    ...scheduleSummaryRowStyle,
                    justifyContent: "center",
                    background: "linear-gradient(135deg, rgba(214,199,184,0.45), rgba(250,247,242,0.92))",
                    fontWeight: "bold",
                  }}>
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "referrals") {
    return withGreeting(
      <div
        style={{
          width: "100%",
          color: "#4b2e1f",
          fontFamily: "Arial",
          direction: "rtl",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "18px",
            right: "18px",
            ...buttonStyle,
            backgroundColor: "#faf7f2",
            color: "#4b2e1f",
            padding: "8px 16px",
            border: "1px solid #d6c7b8",
            borderRadius: "16px",
            fontSize: "13px",
            cursor: "default",
          }}
        >
          عدد العملاء: {referredClients.length}
        </div>

        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <img src={logo} alt="logo" style={{ width: "100px", marginBottom: "14px" }} />
          <h2 style={{ margin: 18, fontSize: "28px", color: "#4b2e1f" }}>العملاء المرشحين</h2>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            justifyContent: "center",
            width: "min(900px, 100%)",
            margin: "0 auto 42px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setShowReferralForm(!showReferralForm)}
            style={{
              ...buttonStyle,
              width: "180px",
              backgroundColor: "#faf7f2",
              color: "#4b2e1f",
              border: "1px solid #d6c7b8",
              marginBottom: 22,
              fontSize: "15px",
            }}
          >
            + Add Referral
          </button>

          <input
            placeholder="Search referrals..."
            value={referralsSearch}
            onChange={(e) => setReferralsSearch(e.target.value)}
            style={{
              ...inputStyle,
              flex: "0 1 600px",
              width: "100%",
              maxWidth: "600px",
              minWidth: "300px",
              marginBottom: 22,
              backgroundColor: "#faf7f2",
              color: "#4b2e1f",
              border: "1px solid #d6c7b8",
              textAlign: "left",
              direction: "ltr",
            }}
          />

          <select
            value={referralsCustomerFilter}
            onChange={(e) => setReferralsCustomerFilter(e.target.value)}
            style={{
              ...inputStyle,
              flex: "0 0 190px",
              width: "190px",
              marginBottom: 22,
              backgroundColor: "#faf7f2",
              color: "#4b2e1f",
              border: "1px solid #d6c7b8",
              textAlign: "center",
              direction: "rtl",
            }}
          >
            <option value="all">الكل</option>
            <option value="existing">عملاء فعليين</option>
            <option value="notExisting">غير مجربين</option>
          </select>
        </div>

        {showReferralForm && (
          <div
            style={{
              backgroundColor: "#faf7f2",
              padding: "18px",
              borderRadius: "22px",
              margin: "0 auto 24px",
              maxWidth: "620px",
            }}
          >
            <input
              placeholder="اسم العميلة المرشحة"
              value={referralName}
              onChange={(e) => setReferralName(e.target.value)}
              style={{
                ...inputStyle,
                width: "60%",
                display: "block",
                margin: "0 auto 12px",
              }}
            />

            <input
              placeholder="رقم جوال المرشحة"
              value={referralPhone}
              onChange={(e) => setReferralPhone(e.target.value)}
              onBlur={() =>
                setReferralPhone(
                  formatSaudiPhoneForStorage(referralPhone)
                )
              }
              style={{
                ...inputStyle,
                width: "60%",
                display: "block",
                margin: "0 auto 12px",
              }}
            />

            <input
              placeholder="مرشحة من"
              value={referralSourceName}
              onChange={(e) => setReferralSourceName(e.target.value)}
              style={{
                ...inputStyle,
                width: "60%",
                display: "block",
                margin: "0 auto 12px",
              }}
            />

            <input
              placeholder="رقم العميلة"
              value={referralSourcePhone}
              onChange={(e) => setReferralSourcePhone(e.target.value)}
              onBlur={() =>
                setReferralSourcePhone(
                  formatSaudiPhoneForStorage(referralSourcePhone)
                )
              }
              style={{
                ...inputStyle,
                width: "60%",
                display: "block",
                margin: "0 auto 12px",
              }}
            />

            <button
              onClick={addManualReferral}
              style={{
                ...buttonStyle,
                backgroundColor: "#4b2e1f",
                color: "white",
                width: "60%",
                display: "block",
                margin: "0 auto 12px",
              }}
            >
              Save Referral
            </button>
          </div>
        )}

        <div
          style={{
            width: "min(1160px, 100%)",
            margin: "34px auto 0",
            overflowX: "auto",
            borderRadius: "20px",
            border: "1px solid #eadfd5",
            background: "rgba(255,255,255,0.76)",
            boxShadow: "0 18px 40px rgba(75,46,31,0.08)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              direction: "rtl",
              color: "#4b2e1f",
              textAlign: "center",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#cbb7a4", color: "black" }}>
                <th style={{ padding: "14px" }}>اسم المرشحة</th>
                <th style={{ padding: "14px" }}>رقم المرشحة</th>
                <th style={{ padding: "14px" }}>مرشحة من</th>
                <th style={{ padding: "14px" }}>رقم العميلة</th>
                <th style={{ padding: "14px" }}>واتساب</th>
                <th style={{ padding: "14px" }}>تعديل</th>
                <th style={{ padding: "14px" }}>حذف</th>
              </tr>
            </thead>

            <tbody>
              {filteredReferredClients.slice(0, referralsVisibleCount).map((referral) => {
                const referralEditId = getReferralEditId(referral);
                const isEditingReferral = editingReferralId === referralEditId;
                const isExistingReferralClient = isExistingClientPhone(referral.phone);
                const referralDuplicateCount = getReferralDuplicateCount(referral.phone);
                const isRepeatedReferral = referralDuplicateCount > 1;
                const referralRowBackground = isExistingReferralClient
                  ? "#dbeafe"
                  : isRepeatedReferral
                  ? "#dcfce7"
                  : "transparent";

                return (
                  <tr
                    key={referralEditId}
                    style={{
                      borderBottom: "1px solid #eadfd5",
                      backgroundColor: referralRowBackground,
                    }}
                  >
                    <td style={{ padding: "14px", fontWeight: "bold" }}>
                      {isEditingReferral ? (
                        <input
                          value={editedReferralName}
                          onChange={(e) => setEditedReferralName(e.target.value)}
                          style={{ ...editInputStyle, width: "110px" }}
                        />
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            flexWrap: "wrap",
                          }}
                        >
                          <span>{referral.name || "-"}</span>
                          {referralDuplicateCount > 1 && (
                            <span
                              style={{
                                backgroundColor: "#22c55e",
                                color: "white",
                                borderRadius: "999px",
                                padding: "3px 8px",
                                fontSize: "11px",
                                fontWeight: "bold",
                                whiteSpace: "nowrap",
                              }}
                            >
                              رشحها {referralDuplicateCount}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "14px" }}>
                      {isEditingReferral ? (
                        <input
                          value={editedReferralPhone}
                          onChange={(e) => setEditedReferralPhone(e.target.value)}
                          onBlur={() => setEditedReferralPhone(formatSaudiPhoneForStorage(editedReferralPhone))}
                          style={{ ...editInputStyle, width: "110px" }}
                        />
                      ) : (
                        referral.phone || "-"
                      )}
                    </td>
                    <td style={{ padding: "14px" }}>
                      {isEditingReferral ? (
                        <input
                          value={editedReferralSourceName}
                          onChange={(e) => setEditedReferralSourceName(e.target.value)}
                          disabled={!referral.manual}
                          style={{ ...editInputStyle, width: "110px", opacity: referral.manual ? 1 : 0.6 }}
                        />
                      ) : (
                        referral.sourceClientName || "-"
                      )}
                    </td>
                    <td style={{ padding: "14px" }}>
                      {isEditingReferral ? (
                        <input
                          value={editedReferralSourcePhone}
                          onChange={(e) => setEditedReferralSourcePhone(e.target.value)}
                          onBlur={() => setEditedReferralSourcePhone(formatSaudiPhoneForStorage(editedReferralSourcePhone))}
                          disabled={!referral.manual}
                          style={{ ...editInputStyle, width: "110px", opacity: referral.manual ? 1 : 0.6 }}
                        />
                      ) : (
                        referral.sourceClientPhone || "-"
                      )}
                    </td>
                    <td style={{ padding: "14px" }}>
                      <button
                        onClick={() => openDirectWhatsApp(referral.phone)}
                        style={{
                          ...buttonStyle,
                          background: "linear-gradient(135deg, #1f9f54, #25D366)",
                          color: "white",
                          padding: "9px 16px",
                          borderRadius: "14px",
                        }}
                      >
                        WhatsApp
                      </button>
                    </td>
                    <td style={{ padding: "14px" }}>
                      {isEditingReferral ? (
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                          <button
                            onClick={() => saveEditedReferral(referral)}
                            style={{ ...buttonStyle, backgroundColor: "#4b2e1f", color: "white", padding: "8px 12px" }}
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditReferral}
                            style={{ ...buttonStyle, backgroundColor: "#f3e8df", color: "#4b2e1f", padding: "8px 12px" }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditReferral(referral)}
                          style={{ ...buttonStyle, backgroundColor: "#f3e8df", color: "#4b2e1f", padding: "9px 16px" }}
                        >
                          Edit
                        </button>
                      )}
                    </td>
                    <td style={{ padding: "14px" }}>
                      <button
                        onClick={() => deleteReferral(referral)}
                        style={{ ...buttonStyle, backgroundColor: "#c3b4a1", color: "white", padding: "9px 16px" }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredReferredClients.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      padding: "25px",
                      color: "#8a7a68",
                    }}
                  >
                    لا توجد أرقام مرشحة حتى الآن
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {renderLoadMoreButtons(
          referralsVisibleCount,
          setReferralsVisibleCount,
          filteredReferredClients.length
        )}
      </div>
    );
  }

if (screen === "finance") {
    const financeMonths = getAvailableFinanceMonths();
    const activeFinanceMonth = financeMonths.includes(selectedFinanceMonth)
      ? selectedFinanceMonth
      : financeMonths[financeMonths.length - 1] || "2026-05";
    const financeStats = getFinanceMonthStats(activeFinanceMonth);
    const financeCardStyle = {
      background: "rgba(255,255,255,0.88)",
      border: "1px solid rgba(214,199,184,0.88)",
      borderRadius: "24px",
      padding: "18px",
      boxShadow: "0 14px 34px rgba(75,46,31,0.08)",
    };
    const financeSummaryCardStyle = {
      ...financeCardStyle,
      minHeight: "94px",
      padding: "14px 10px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      boxSizing: "border-box",
    };
    const financeHeaderStyle = {
      margin: "0 0 14px",
      color: "#4b2e1f",
      fontSize: "18px",
      fontWeight: "900",
      textAlign: "center",
    };
    const financeRowStyle = {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "12px",
      borderTop: "1px solid #eadfd5",
      padding: "10px 0",
      color: "#4b2e1f",
      fontSize: "14px",
      fontWeight: "700",
    };
    const financeSmallInputStyle = {
      ...scheduleSummaryInputStyle,
      width: "110px",
      height: "36px",
      margin: 0,
      boxSizing: "border-box",
    };
    const renderFinanceRows = (rows) =>
      rows.map(([label, value]) => (
        <div key={label} style={financeRowStyle}>
          <span>{label}</span>
          <strong>{formatCurrency(value)}</strong>
        </div>
      ));

    return withGreeting(
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          background: "radial-gradient(circle at top, #fffaf3, #ebe1d3 48%, #d8c5b3)",
          padding: "24px",
          boxSizing: "border-box",
          fontFamily: "Arial",
          color: "#4b2e1f",
        }}
      >
        <div
          style={{
            width: "min(1360px, 100%)",
            margin: "0 auto",
            display: "block",
            direction: "ltr",
          }}
        >
          <main style={{ direction: "ltr", paddingTop: 0 }}>
            <div
              style={{
                ...financeCardStyle,
                position: "fixed",
                top: "18px",
                left: "24px",
                right: "24px",
                zIndex: 9999,
                marginBottom: "22px",
                background: "linear-gradient(135deg, rgba(75,46,31,0.98), rgba(138,106,80,0.94))",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "14px",
                flexWrap: "nowrap",
                overflow: "hidden",
                boxSizing: "border-box",
              }}
            >
              <div>
                <div style={{ fontSize: "13px", opacity: 0.82, marginBottom: "6px" }}>
                  Paradise Spa
                </div>
                <h2 style={{ margin: 0, fontSize: "28px", whiteSpace: "nowrap" }}>
                  {getFinanceMonthLabel(activeFinanceMonth)} Reports
                </h2>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexShrink: 0,
                }}
              >
                <select
                  value={activeFinanceMonth}
                  onChange={(event) => setSelectedFinanceMonth(event.target.value)}
                  style={{
                    ...inputStyle,
                    width: "210px",
                    height: "52px",
                    minHeight: "52px",
                    borderRadius: "18px",
                    textAlign: "center",
                    fontWeight: "900",
                    fontSize: "15px",
                    lineHeight: "1",
                    color: "#4b2e1f",
                    backgroundColor: "#fffaf3",
                    padding: "0 18px",
                    margin: 0,
                    boxSizing: "border-box",
                  }}
                >
                  {financeMonths.map((monthKey) => (
                    <option key={monthKey} value={monthKey}>
                      {getFinanceMonthLabel(monthKey)}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => exportFinanceMonthToExcel(activeFinanceMonth)}
                  style={{
                    ...buttonStyle,
                    background: "white",
                    color: "#4b2e1f",
                    height: "52px",
                    minHeight: "52px",
                    borderRadius: "18px",
                    padding: "0 22px",
                    margin: 0,
                    lineHeight: "1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
                    whiteSpace: "nowrap",
                    boxSizing: "border-box",
                  }}
                >
                  تحميل Excel
                </button>
              </div>
            </div>

            <div style={{ height: "116px", flexShrink: 0 }} />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, minmax(120px, 1fr))",
                gap: "10px",
                marginBottom: "22px",
              }}
            >
              {[
                ["Total Income", financeStats.totalIncome],
                ["Total Expenses", financeStats.totalExpenses],
                ["Total Net Profit", financeStats.totalNetProfit],
                ["AVG Daily Income", financeStats.averageDailyIncome],
                ["AVG Daily Expenses", financeStats.averageDailyExpenses],
                ["AVG Daily Net Income", financeStats.averageDailyNetIncome],
              ].map(([label, value]) => (
                <div key={label} style={financeSummaryCardStyle}>
                  <div style={{ width: "100%", color: "#8a7a68", fontSize: "11px", fontWeight: "800", whiteSpace: "nowrap", textAlign: "center" }}>
                    {label}
                  </div>
                  <strong style={{ display: "block", width: "100%", fontSize: "22px", marginTop: "7px", textAlign: "center" }}>
                    {formatCurrency(value)}
                  </strong>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
                gap: "18px",
                marginBottom: "22px",
              }}
            >
              <div style={financeCardStyle}>
                <h3 style={financeHeaderStyle}>Monthly Settings</h3>
                {[
                  ["monthlyTarget", "May Target"],
                  ["staffSalary", "Staff Salary"],
                  ["houseRent", "House Rent"],
                  ["carRent", "Car Rent"],
                  ["governmentFees", "Government Fees"],
                ].map(([field, label]) => (
                  <div key={field} style={financeRowStyle}>
                    <span>{label}</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={
                        financeMonthlySettings[activeFinanceMonth]?.[field] ??
                        financeStats.monthlySettings[field] ??
                        ""
                      }
                      onChange={(event) =>
                        updateFinanceMonthlySetting(activeFinanceMonth, field, event.target.value)
                      }
                      style={financeSmallInputStyle}
                    />
                  </div>
                ))}
              </div>

              <div style={financeCardStyle}>
                <h3 style={financeHeaderStyle}>Payment Method</h3>
                {renderFinanceRows([
                  ["Cash", financeStats.paymentTotals.Cash],
                  ["Debit", financeStats.paymentTotals.Debit],
                  ["Credit", financeStats.paymentTotals.Credit],
                  ["Tabby", financeStats.paymentTotals.Tabby],
                  ["Tamara", financeStats.paymentTotals.Tamara],
                  ["Bank Transfer", financeStats.paymentTotals["Bank Transfer"]],
                  ["Paid", financeStats.paymentTotals.Paid],
                  ["Total", financeStats.paymentTotal],
                ])}
              </div>

              <div style={financeCardStyle}>
                <h3 style={financeHeaderStyle}>Operating Expenses</h3>
                {renderFinanceRows([
                  ["Gas Station", financeStats.operatingExpenses["Gas Station"]],
                  ["Commission", financeStats.operatingExpenses.Commission],
                  ["Purchase", financeStats.operatingExpenses.Purchase],
                  ["House Rent", financeStats.operatingExpenses["House Rent"]],
                  ["Car Rent", financeStats.operatingExpenses["Car Rent"]],
                  ["Uber", financeStats.operatingExpenses.Uber],
                  ["Laundry", financeStats.operatingExpenses.Laundry],
                  ["Food", financeStats.operatingExpenses.Food],
                  ["Government Fees", financeStats.operatingExpenses["Government Fees"]],
                  ["Salary", financeStats.operatingExpenses.Salary],
                  [
                    "Total",
                    Object.values(financeStats.operatingExpenses).reduce(
                      (total, value) => total + parseAmount(value),
                      0
                    ),
                  ],
                ])}
              </div>

              <div style={financeCardStyle}>
                <h3 style={financeHeaderStyle}>Target</h3>
                {renderFinanceRows([
                  ["May Target", financeStats.monthlyTarget],
                  ["Target by service", financeStats.targetByService],
                  ["Remaining Services", financeStats.remainingServicesToTarget],
                  ["AVG Service Price", financeStats.averageServicePrice],
                  ["Total Services", financeStats.totalServices],
                ])}
              </div>

              <div style={financeCardStyle}>
                <h3 style={financeHeaderStyle}>Clients</h3>
                {renderFinanceRows([
                  ["New Clients", financeStats.newClients],
                  ["Loyal Clients", financeStats.loyalClients],
                ])}
              </div>

              <div style={financeCardStyle}>
                <h3 style={financeHeaderStyle}>Gifts</h3>
                {renderFinanceRows([
                  ["Gifts Added", financeStats.giftsAdded],
                  ["Gifts Received", financeStats.giftsReceived],
                ])}
              </div>

              <div style={financeCardStyle}>
                <h3 style={financeHeaderStyle}>Loyalty Card Gifts</h3>
                {renderFinanceRows([
                  ["1 Service", financeStats.freeGifts],
                  ["2 Service", financeStats.twoFreeGifts],
                ])}
              </div>

              <div style={financeCardStyle}>
                <h3 style={financeHeaderStyle}>Transportation</h3>
                {renderFinanceRows([["Transportation", financeStats.totalTransportation]])}
              </div>

              <div style={financeCardStyle}>
                <h3 style={financeHeaderStyle}>Cancelled Appointments</h3>
                {renderFinanceRows([
                  ["Cancelled Appointments", financeStats.clientsTurnedAway],
                  ["Lost Revenue", financeStats.lostRevenue],
                  ["Potential Revenue", financeStats.potentialRevenue],
                ])}
              </div>
            </div>

            <div
              style={{
                ...financeCardStyle,
                marginBottom: "22px",
                overflow: "hidden",
              }}
            >
              <h3 style={financeHeaderStyle}>Daily Income / Expenses / Net Profit</h3>
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: "620px",
                    color: "#4b2e1f",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#cbb7a4", color: "#111" }}>
                      {["Date", "Income", "Expenses", "Net Profit"].map((heading) => (
                        <th
                          key={heading}
                          style={{
                            padding: "14px 10px",
                            textAlign: "center",
                            fontSize: "14px",
                            fontWeight: "900",
                            border: "1px solid #d6c7b8",
                          }}
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {financeStats.dayStats.map((day) => (
                      <tr key={day.date}>
                        <td style={{ padding: "12px 10px", textAlign: "center", border: "1px solid #eadfd5", fontWeight: "800" }}>
                          {day.date}
                        </td>
                        <td style={{ padding: "12px 10px", textAlign: "center", border: "1px solid #eadfd5" }}>
                          {formatCurrency(day.income)}
                        </td>
                        <td style={{ padding: "12px 10px", textAlign: "center", border: "1px solid #eadfd5" }}>
                          {formatCurrency(day.expenses)}
                        </td>
                        <td style={{ padding: "12px 10px", textAlign: "center", border: "1px solid #eadfd5", fontWeight: "900" }}>
                          {formatCurrency(day.netProfit)}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ background: "#ead8c9", fontWeight: "900" }}>
                      <td style={{ padding: "12px 10px", textAlign: "center", border: "1px solid #d6c7b8" }}>Total</td>
                      <td style={{ padding: "12px 10px", textAlign: "center", border: "1px solid #d6c7b8" }}>{formatCurrency(financeStats.totalIncome)}</td>
                      <td style={{ padding: "12px 10px", textAlign: "center", border: "1px solid #d6c7b8" }}>{formatCurrency(financeStats.totalExpenses)}</td>
                      <td style={{ padding: "12px 10px", textAlign: "center", border: "1px solid #d6c7b8" }}>{formatCurrency(financeStats.totalNetProfit)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </main>
        </div>
      </div>
    );
  }

  if (screen === "incomeExpenses") {
    const reportMonths = getIncomeExpenseReportMonths();
    const reportRows = getFilteredIncomeExpenseReportRows();
    const reportFields = [
      ["income", "Income"],
      ["expenses", "Expenses"],
      ["netIncome", "Net income"],
      ["cash", "Cash"],
      ["bankTransfer", "Bank Transfer"],
      ["avgServicePrice", "AVG Service Price"],
      ["newClients", "New Clients"],
      ["loyalClients", "Loyal Clients"],
      ["giftsAdded", "Gifts Added"],
      ["giftsReceived", "Gifts Received"],
      ["free1Service", "Free 1 Service"],
      ["free2Services", "Free 2 Services"],
      ["massage", "Massage"],
      ["maniPedi", "Mani / Pedi"],
      ["cancelledApp", "Cancelled App"],
    ];
    const reportTotals = reportRows.reduce(
      (totals, row) => {
        reportFields.forEach(([field]) => {
          totals[field] = (totals[field] || 0) + parseAmount(row[field]);
        });
        return totals;
      },
      {}
    );
    const averageServiceRows = reportRows.filter((row) => parseAmount(row.avgServicePrice) > 0);
    reportTotals.avgServicePrice = averageServiceRows.length
      ? averageServiceRows.reduce((total, row) => total + parseAmount(row.avgServicePrice), 0) /
        averageServiceRows.length
      : 0;
    const reportInputStyle = {
      width: "100%",
      border: "none",
      background: "transparent",
      textAlign: "center",
      fontWeight: "700",
      color: "#111",
      outline: "none",
      padding: "0 1px",
      boxSizing: "border-box",
      height: "18px",
      lineHeight: "16px",
    };
    const reportCellStyle = {
      ...scheduleCellStyle,
      padding: "0 2px",
      height: "20px",
      lineHeight: "18px",
      fontSize: "14px",
      fontWeight: "700",
      color: "#111",
      whiteSpace: "nowrap",
    };
    const reportHeaderCellStyle = {
      ...scheduleHeaderCellStyle,
      position: "sticky",
      top: 0,
      padding: "2px 5px",
      height: "22px",
      lineHeight: "18px",
    };

    return withGreeting(
      <div
        style={{
          width: "100%",
          color: "#4b2e1f",
          fontFamily: "Arial",
          direction: "ltr",
        }}
      >
        <div
  style={{
    textAlign: "center",
    marginBottom: "60px",
  }}
>
  <img
    src={logo}
    alt="logo"
    style={{
      width: "100px",
      marginBottom: "35px",
      display: "block",
      marginInline: "auto",
    }}
  />

  <h2
    style={{
      margin: 0,
      marginBottom: "25px",
      fontSize: "28px",
      color: "#4b2e1f",
    }}
  >
    الدخل والمصاريف
  </h2>
</div>

<div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    direction: "ltr",
    transform: "translateY(-15px)",
  }}
>
          <label style={{ fontWeight: "900" }}>From</label>
          <select
            value={incomeExpensesFromMonth}
            onChange={(event) => setIncomeExpensesFromMonth(event.target.value)}
            style={{ ...inputStyle, width: "160px", margin: 0, textAlign: "center" }}
          >
            {reportMonths.map((monthKey) => (
              <option key={monthKey} value={monthKey}>
                {getShortMonthLabel(monthKey)}
              </option>
            ))}
          </select>

          <label style={{ fontWeight: "900" }}>To</label>
          <select
            value={incomeExpensesToMonth}
            onChange={(event) => setIncomeExpensesToMonth(event.target.value)}
            style={{ ...inputStyle, width: "160px", margin: 0, textAlign: "center" }}
          >
            {reportMonths.map((monthKey) => (
              <option key={monthKey} value={monthKey}>
                {getShortMonthLabel(monthKey)}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIncomeExpensesEditMode((prev) => !prev)}
            style={{
              ...buttonStyle,
              background: incomeExpensesEditMode
                ? "linear-gradient(135deg, #1f9f54, #25D366)"
                : "linear-gradient(135deg, #4b2e1f, #7a5a43)",
              color: "white",
              padding: "12px 22px",
              borderRadius: "16px",
            }}
          >
            {incomeExpensesEditMode ? "Save" : "Edit"}
          </button>
        </div>

        <div style={scheduleTableWrapperStyle}>
          <table
            style={{
              minWidth: "max-content",
              width: "max-content",
              borderCollapse: "collapse",
              borderSpacing: 0,
              color: "#4b2e1f",
            }}
          >
            <thead>
              <tr>
                <th style={{ ...reportHeaderCellStyle, width: "90px", minWidth: "90px" }}>Date</th>
                {reportFields.map(([, label]) => (
                  <th key={label} style={{ ...reportHeaderCellStyle, width: "112px", minWidth: "112px" }}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportRows.map((row, index) => (
                <tr key={row.monthKey} style={{ backgroundColor: index % 2 === 0 ? "#fffaf3" : "#f2e7da" }}>
                  <td style={reportCellStyle}>{row.date}</td>
                  {reportFields.map(([field]) => {
                    const manualValue = getIncomeExpenseManualData(row.monthKey)[field] ?? "";
                    return (
                      <td key={field} style={reportCellStyle}>
                        {incomeExpensesEditMode ? (
                          <input
                            value={manualValue}
                            placeholder={formatCurrency(row[field])}
                            onChange={(event) =>
                              updateIncomeExpenseManualData(row.monthKey, field, event.target.value)
                            }
                            style={reportInputStyle}
                          />
                        ) : (
                          formatCurrency(row[field])
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr style={{ backgroundColor: "#c9b2a2", fontWeight: "900" }}>
                <td style={{ ...reportCellStyle, fontWeight: "900" }}>Total</td>
                {reportFields.map(([field]) => (
                  <td key={field} style={{ ...reportCellStyle, fontWeight: "900" }}>{formatCurrency(reportTotals[field])}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (screen === "giftClients") {
    return withGreeting(
      <div
        style={{
          width: "100%",
          color: "#4b2e1f",
          fontFamily: "Arial",
          direction: "rtl",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "18px",
            right: "18px",
            ...buttonStyle,
            backgroundColor: "#faf7f2",
            color: "#4b2e1f",
            padding: "8px 16px",
            border: "1px solid #d6c7b8",
            borderRadius: "16px",
            fontSize: "13px",
            cursor: "default",
          }}
        >
          عدد العملاء: {giftClients.length}
        </div>

        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <img src={logo} alt="logo" style={{ width: "100px", marginBottom: "14px" }} />
          <h2 style={{ margin: 18, fontSize: "28px", color: "#4b2e1f" }}>عملاء الإهداء</h2>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            justifyContent: "center",
            width: "min(900px, 100%)",
            margin: "0 auto 42px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setShowGiftForm(!showGiftForm)}
            style={{
              ...buttonStyle,
              width: "180px",
              backgroundColor: "#faf7f2",
              color: "#4b2e1f",
              border: "1px solid #d6c7b8",
              marginBottom: 22,
              fontSize: "15px",
            }}
          >
            + Add Gift
          </button>

          <input
            placeholder="Search gift clients..."
            value={giftSearch}
            onChange={(e) => setGiftSearch(e.target.value)}
            style={{
              ...inputStyle,
              flex: "0 1 600px",
              width: "100%",
              maxWidth: "600px",
              minWidth: "300px",
              marginBottom: 22,
              backgroundColor: "#faf7f2",
              color: "#4b2e1f",
              border: "1px solid #d6c7b8",
              textAlign: "left",
              direction: "ltr",
            }}
          />

          <select
            value={giftStatusFilter}
            onChange={(e) => setGiftStatusFilter(e.target.value)}
           style={{
  ...inputStyle,
  flex: "0 0 190px",
  width: "190px",
  marginBottom: 22,
  backgroundColor: "#faf7f2",
  color: "#4b2e1f",
  border: "1px solid #d6c7b8",
  textAlign: "center",
  direction: "rtl",
}}
          >
            <option value="all">كل عملاء الإهداء</option>
            <option value="taken">استلموا الهدية</option>
            <option value="pending">لم يستلموا الهدية</option>
          </select>
        </div>

        {showGiftForm && (
          <div
            style={{
              backgroundColor: "#faf7f2",
              padding: "18px",
              borderRadius: "22px",
              margin: "0 auto 24px",
              maxWidth: "620px",
            }}
          >
            <input
              placeholder="من"
              value={giftFromName}
              onChange={(e) => setGiftFromName(e.target.value)}
              style={{
                ...inputStyle,
                width: "60%",
                display: "block",
                margin: "0 auto 12px",
              }}
            />
            <input
              placeholder="رقم جوال المُهدي"
              value={giftFromPhone}
              onChange={(e) => setGiftFromPhone(e.target.value)}
              onBlur={() => setGiftFromPhone(formatSaudiPhoneForStorage(giftFromPhone))}
              style={{
                ...inputStyle,
                width: "60%",
                display: "block",
                margin: "0 auto 12px",
              }}
            />
            <input
              placeholder="إلى"
              value={giftToName}
              onChange={(e) => setGiftToName(e.target.value)}
              style={{
                ...inputStyle,
                width: "60%",
                display: "block",
                margin: "0 auto 12px",
              }}
            />
            <input
              placeholder="رقم جوال المستلم"
              value={giftToPhone}
              onChange={(e) => setGiftToPhone(e.target.value)}
              onBlur={() => setGiftToPhone(formatSaudiPhoneForStorage(giftToPhone))}
              style={{
                ...inputStyle,
                width: "60%",
                display: "block",
                margin: "0 auto 12px",
              }}
            />
            <input
              placeholder="خدمة الهدية"
              value={giftService}
              onChange={(e) => setGiftService(e.target.value)}
              style={{
                ...inputStyle,
                width: "60%",
                display: "block",
                margin: "0 auto 12px",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                flexWrap: "wrap",
                margin: "2px 0 12px",
              }}
              
            >
             <div
  style={{
    width: "100%",
    marginBottom: "14px",
  }}
>
  <input
    type="date"
    value={giftDate}
    onChange={(e) => setGiftDate(e.target.value)}
    style={{
  width: "63%",
  padding: "16px",
  borderRadius: "20px",
  justifyContent: "center",
display: "flex",
marginLeft: "auto",
marginRight: "auto",
  border: "1px solid #d8c7b8",
  background: "#faf7f2",
  color: "#4b2e1f",
  fontSize: "15px",
  boxSizing: "border-box",
}}
  />
</div>
              {[
                ["balloon", "بالون"],
                ["flowers", "ورد"],
                ["cake", "كيك"],
              ].map(([key, label]) => (
                <label
                  key={key}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: giftItems[key] ? "#4b2e1f" : "#faf7f2",
                    color: giftItems[key] ? "white" : "#4b2e1f",
                    border: "1px solid #d6c7b8",
                    borderRadius: "999px",
                    padding: "10px 16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={giftItems[key]}
                    onChange={(e) =>
                      setGiftItems((prev) => ({
                        ...prev,
                        [key]: e.target.checked,
                      }))
                    }
                  />
                  {label}
                </label>
              ))}
            </div>

            <button
              onClick={addGiftClient}
              style={{
                ...buttonStyle,
                backgroundColor: "#4b2e1f",
                color: "white",
                width: "60%",
                display: "block",
                margin: "0 auto 45px",
              }}
            >
              Save Gift Client
            </button>
          </div>
        )}

        <div
          style={{
            width: "min(1160px, 100%)",
            margin: "34px auto 0",
            overflowX: "auto",
            borderRadius: "20px",
            border: "1px solid #eadfd5",
            background: "rgba(255,255,255,0.76)",
            boxShadow: "0 18px 40px rgba(75,46,31,0.08)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              direction: "rtl",
              color: "#4b2e1f",
              textAlign: "center",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#cbb7a4", color: "black" }}>
                <th style={{ padding: "12px" }}>تاريخ الإهداء</th>
                <th style={{ padding: "12px" }}>من</th>
                <th style={{ padding: "12px" }}>رقم المُهدي</th>
                <th style={{ padding: "12px" }}>إلى</th>
                <th style={{ padding: "12px" }}>رقم المستلم</th>
                <th style={{ padding: "12px" }}>خدمة الهدية</th>
                <th style={{ padding: "12px" }}>الإضافات</th>
                <th style={{ padding: "12px" }}>استلمت الهدية</th>
                <th style={{ padding: "12px" }}>تعديل</th>
                <th style={{ padding: "12px" }}>حذف</th>
              </tr>
            </thead>
            <tbody>
              {filteredGiftClients.slice(0, giftVisibleCount).map((gift) => {
                const isEditingGift = editingGiftId === gift.id;

                return (
                  <tr
                    key={gift.id}
                    style={{
                      borderBottom: "1px solid #eadfd5",
                      backgroundColor: gift.giftTaken ? "#d9ebf7" : "transparent",
                    }}
                  >
                    <td style={{ padding: "14px" }}>
                      {String(gift.giftDate || "").slice(0, 10) || "-"}
                    </td>
                    <td style={{ padding: "14px", fontWeight: "bold" }}>
                      {isEditingGift ? (
                        <input value={editedGiftFromName} onChange={(e) => setEditedGiftFromName(e.target.value)} style={{ ...editInputStyle, width: "105px" }} />
                      ) : (
                        gift.fromName || "-"
                      )}
                    </td>
                    <td style={{ padding: "14px" }}>
                      {isEditingGift ? (
                        <input value={editedGiftFromPhone} onChange={(e) => setEditedGiftFromPhone(e.target.value)} onBlur={() => setEditedGiftFromPhone(formatSaudiPhoneForStorage(editedGiftFromPhone))} style={{ ...editInputStyle, width: "105px" }} />
                      ) : (
                        gift.fromPhone || "-"
                      )}
                    </td>
                    <td style={{ padding: "14px", fontWeight: "bold" }}>
                      {isEditingGift ? (
                        <input value={editedGiftToName} onChange={(e) => setEditedGiftToName(e.target.value)} style={{ ...editInputStyle, width: "105px" }} />
                      ) : (
                        gift.toName || "-"
                      )}
                    </td>
                    <td style={{ padding: "14px" }}>
                      {isEditingGift ? (
                        <input value={editedGiftToPhone} onChange={(e) => setEditedGiftToPhone(e.target.value)} onBlur={() => setEditedGiftToPhone(formatSaudiPhoneForStorage(editedGiftToPhone))} style={{ ...editInputStyle, width: "105px" }} />
                      ) : (
                        gift.toPhone || "-"
                      )}
                    </td>
                    <td style={{ padding: "14px" }}>
                      {isEditingGift ? (
                        <input value={editedGiftService} onChange={(e) => setEditedGiftService(e.target.value)} style={{ ...editInputStyle, width: "105px" }} />
                      ) : (
                        gift.service || "-"
                      )}
                    </td>
                    <td style={{ padding: "14px" }}>
                      {isEditingGift ? (
                        <div style={{ display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap" }}>
                          {[
                            ["balloon", "بالون"],
                            ["flowers", "ورد"],
                            ["cake", "كيك"],
                          ].map(([key, label]) => (
                            <label key={key} style={{ display: "inline-flex", gap: "4px", alignItems: "center", fontSize: "12px" }}>
                              <input
                                type="checkbox"
                                checked={editedGiftItems[key]}
                                onChange={(e) =>
                                  setEditedGiftItems((prev) => ({
                                    ...prev,
                                    [key]: e.target.checked,
                                  }))
                                }
                              />
                              {label}
                            </label>
                          ))}
                        </div>
                      ) : (
                        [
                          gift.items?.balloon && "بالون",
                          gift.items?.flowers && "ورد",
                          gift.items?.cake && "كيك",
                        ]
                          .filter(Boolean)
                          .join(" / ") || "-"
                      )}
                    </td>
                    <td style={{ padding: "14px" }}>
                      <input
                        type="checkbox"
                        checked={!!gift.giftTaken}
                        onChange={(e) => updateGiftTaken(gift, e.target.checked)}
                        style={{ width: "18px", height: "18px", cursor: "pointer" }}
                      />
                    </td>
                    
                    <td style={{ padding: "14px" }}>
                      {isEditingGift ? (
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                          <button onClick={() => saveEditedGift(gift.id)} style={{ ...buttonStyle, backgroundColor: "#4b2e1f", color: "white", padding: "8px 12px" }}>Save</button>
                          <button onClick={cancelEditGift} style={{ ...buttonStyle, backgroundColor: "#f3e8df", color: "#4b2e1f", padding: "8px 12px" }}>Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => startEditGift(gift)} style={{ ...buttonStyle, backgroundColor: "#f3e8df", color: "#4b2e1f", padding: "9px 16px" }}>Edit</button>
                      )}
                    </td>
                    <td style={{ padding: "14px" }}>
                      <button onClick={() => deleteGiftClient(gift.id)} style={{ ...buttonStyle, backgroundColor: "#c3b4a1", color: "white", padding: "9px 16px" }}>Delete</button>
                    </td>
                  </tr>
                );
              })}

              {filteredGiftClients.length === 0 && (
                <tr>
                  <td colSpan="11" style={{ padding: "28px", color: "#8a7a68" }}>
                    لا توجد بيانات إهداء حتى الآن
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

if (screen === "potentialClients") {
    return withGreeting(
      <div
        style={{
          width: "100%",
          color: "#4b2e1f",
          fontFamily: "Arial",
          direction: "rtl",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "18px",
            right: "18px",
            ...buttonStyle,
            backgroundColor: "#faf7f2",
            color: "#4b2e1f",
            padding: "8px 16px",
            border: "1px solid #d6c7b8",
            borderRadius: "16px",
            fontSize: "13px",
            cursor: "default",
          }}
        >
          عدد العملاء: {potentialClients.length}
        </div>

        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <img src={logo} alt="logo" style={{ width: "100px", marginBottom: "14px" }} />
          <h2 style={{ margin: 18, fontSize: "28px", color: "#4b2e1f" }}>العملاء المحتملين</h2>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            justifyContent: "center",
            width: "min(900px, 100%)",
            margin: "0 auto 42px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setShowPotentialForm(!showPotentialForm)}
            style={{
              ...buttonStyle,
              width: "180px",
              backgroundColor: "#faf7f2",
              color: "#4b2e1f",
              border: "1px solid #d6c7b8",
              marginBottom: 22,
              fontSize: "15px",
            }}
          >
            + Add Prospect
          </button>

          <input
            placeholder="Search prospects..."
            value={potentialSearch}
            onChange={(e) => setPotentialSearch(e.target.value)}
            style={{
              ...inputStyle,
              flex: "0 1 600px",
              width: "100%",
              maxWidth: "600px",
              minWidth: "300px",
              marginBottom: 22,
              backgroundColor: "#faf7f2",
              color: "#4b2e1f",
              border: "1px solid #d6c7b8",
              textAlign: "left",
              direction: "ltr",
            }}
          />

          <select
            value={potentialCustomerFilter}
            onChange={(e) => setPotentialCustomerFilter(e.target.value)}
            style={{
              ...inputStyle,
              flex: "0 0 190px",
              width: "190px",
              marginBottom: 22,
              backgroundColor: "#faf7f2",
              color: "#4b2e1f",
              border: "1px solid #d6c7b8",
              textAlign: "center",
              direction: "rtl",
            }}
          >
            <option value="all">الكل</option>
            <option value="existing">عملاء فعليين</option>
            <option value="notExisting">غير مجربين</option>
          </select>
        </div>

        {showPotentialForm && (
          <div
            style={{
              backgroundColor: "#faf7f2",
              padding: "18px",
              borderRadius: "22px",
              margin: "0 auto 24px",
              maxWidth: "620px",
            }}
          >
            <input
              placeholder="الاسم"
              value={potentialName}
              onChange={(e) => setPotentialName(e.target.value)}
              style={{
                ...inputStyle,
                width: "60%",
                display: "block",
                margin: "0 auto 12px",
              }}
            />
            <input
              placeholder="رقم الجوال"
              value={potentialPhone}
              onChange={(e) => setPotentialPhone(e.target.value)}
              onBlur={() => setPotentialPhone(formatSaudiPhoneForStorage(potentialPhone))}
              style={{
                ...inputStyle,
                width: "60%",
                display: "block",
                margin: "0 auto 12px",
              }}
            />
            <input
              list="potentialStatusOptions"
              placeholder="إلغاء موعد أو إستفسار"
              value={potentialStatus}
              onFocus={(e) => e.target.showPicker?.()}
              onClick={(e) => e.target.showPicker?.()}
              onChange={(e) => setPotentialStatus(e.target.value)}
              style={{
                ...inputStyle,
                width: "60%",
                display: "block",
                margin: "0 auto 12px",
              }}
            />

            <button
              onClick={addPotentialClient}
              style={{
                ...buttonStyle,
                backgroundColor: "#4b2e1f",
                color: "white",
                width: "60%",
                display: "block",
                margin: "0 auto 12px",
              }}
            >
              Save Potential Client
            </button>
          </div>
        )}

        <datalist id="potentialStatusOptions">
          <option value="إلغاء موعد" />
          <option value="إستفسار" />
        </datalist>

        <div
          style={{
            width: "min(1160px, 100%)",
            margin: "34px auto 0",
            overflowX: "auto",
            borderRadius: "20px",
            border: "1px solid #eadfd5",
            background: "rgba(255,255,255,0.76)",
            boxShadow: "0 18px 40px rgba(75,46,31,0.08)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              direction: "rtl",
              color: "#4b2e1f",
              textAlign: "center",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#cbb7a4", color: "black" }}>
                <th style={{ padding: "14px" }}>الاسم</th>
                <th style={{ padding: "14px" }}>رقم الجوال</th>
                <th style={{ padding: "14px" }}>الحالة</th>
                <th style={{ padding: "14px" }}>واتساب</th>
                <th style={{ padding: "14px" }}>تعديل</th>
                <th style={{ padding: "14px" }}>حذف</th>
              </tr>
            </thead>
            <tbody>
              {filteredPotentialClients.slice(0, potentialVisibleCount).map((client) => {
                const isEditingPotential = editingPotentialId === client.id;
                const isExistingPotentialClient = isExistingClientPhone(client.phone);

                return (
                  <tr
                    key={client.id}
                    style={{
                      borderBottom: "1px solid #eadfd5",
                      backgroundColor: isExistingPotentialClient ? "#dbeafe" : "transparent",
                    }}
                  >
                    <td style={{ padding: "14px", fontWeight: "bold" }}>
                      {isEditingPotential ? (
                        <input
                          value={editedPotentialName}
                          onChange={(e) => setEditedPotentialName(e.target.value)}
                          style={{ ...editInputStyle, width: "120px" }}
                        />
                      ) : (
                        client.name || "-"
                      )}
                    </td>
                    <td style={{ padding: "14px" }}>
                      {isEditingPotential ? (
                        <input
                          value={editedPotentialPhone}
                          onChange={(e) => setEditedPotentialPhone(e.target.value)}
                          onBlur={() => setEditedPotentialPhone(formatSaudiPhoneForStorage(editedPotentialPhone))}
                          style={{ ...editInputStyle, width: "120px" }}
                        />
                      ) : (
                        client.phone || "-"
                      )}
                    </td>
                    <td style={{ padding: "14px" }}>
                      {isEditingPotential ? (
                        <input
                          list="potentialStatusOptions"
                          value={editedPotentialStatus}
                          onFocus={(e) => e.target.showPicker?.()}
                          onClick={(e) => e.target.showPicker?.()}
                          onChange={(e) => setEditedPotentialStatus(e.target.value)}
                          style={{ ...editInputStyle, width: "130px" }}
                        />
                      ) : (
                        client.status || "-"
                      )}
                    </td>
                    <td style={{ padding: "14px" }}>
                      <button
                        onClick={() => openDirectWhatsApp(client.phone)}
                        style={{
                          ...buttonStyle,
                          background: "linear-gradient(135deg, #1f9f54, #25D366)",
                          color: "white",
                          padding: "9px 16px",
                          borderRadius: "14px",
                        }}
                      >
                        WhatsApp
                      </button>
                    </td>
                    <td style={{ padding: "14px" }}>
                      {isEditingPotential ? (
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                          <button
                            onClick={() => saveEditedPotentialClient(client.id)}
                            style={{ ...buttonStyle, backgroundColor: "#4b2e1f", color: "white", padding: "8px 12px" }}
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditPotentialClient}
                            style={{ ...buttonStyle, backgroundColor: "#f3e8df", color: "#4b2e1f", padding: "8px 12px" }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditPotentialClient(client)}
                          style={{ ...buttonStyle, backgroundColor: "#f3e8df", color: "#4b2e1f", padding: "9px 16px" }}
                        >
                          Edit
                        </button>
                      )}
                    </td>
                    <td style={{ padding: "14px" }}>
                      <button
                        onClick={() => deletePotentialClient(client.id)}
                        style={{ ...buttonStyle, backgroundColor: "#c3b4a1", color: "white", padding: "9px 16px" }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredPotentialClients.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: "28px", color: "#8a7a68" }}>
                    لا توجد بيانات عملاء محتملين حتى الآن
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {renderLoadMoreButtons(
          potentialVisibleCount,
          setPotentialVisibleCount,
          filteredPotentialClients.length
        )}
      </div>
    );
  }


  const formatAvailableDateForPoster = (dateString) => {
    const date = new Date(`${dateString}T12:00:00`);
    const dayName = date.toLocaleDateString("ar-SA", { weekday: "long" });
    const dayNumber = date.toLocaleDateString("ar-SA", { day: "numeric" });
    const monthName = date.toLocaleDateString("ar-SA", { month: "long" });

    return `${dayName} ${dayNumber} ${monthName}`;
  };

  const toggleAvailableAppointmentStatus = (time) => {
    setAvailableAppointmentStatus((prev) => ({
      ...prev,
      [time]: prev[time] === "available" ? "booked" : "available",
    }));
  };

  const setAllAvailableAppointmentsStatus = (status) => {
    setAvailableAppointmentStatus(
      availableAppointmentTimes.reduce(
        (statusMap, time) => ({
          ...statusMap,
          [time]: status,
        }),
        {}
      )
    );
  };

  const saveAvailableAppointmentsImage = async () => {
    if (!availablePosterRef.current) return;

    let posterClone = null;

    try {
      const posterElement = availablePosterRef.current;
      const posterWidth = 540;
      const posterHeight = 744;

      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      posterClone = posterElement.cloneNode(true);
      posterClone.style.width = `${posterWidth}px`;
      posterClone.style.height = `${posterHeight}px`;
      posterClone.style.maxWidth = "none";
      posterClone.style.minWidth = `${posterWidth}px`;
      posterClone.style.minHeight = `${posterHeight}px`;
      posterClone.style.position = "fixed";
      posterClone.style.left = "-10000px";
      posterClone.style.top = "0";
      posterClone.style.transform = "none";
      posterClone.style.margin = "0";
      posterClone.style.boxShadow = "none";
      posterClone.style.overflow = "hidden";
      posterClone.style.zIndex = "-1";

      document.body.appendChild(posterClone);

      const canvas = await html2canvas(posterClone, {
        scale: 4,
        useCORS: true,
        backgroundColor: null,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: posterWidth,
        windowHeight: posterHeight,
        width: posterWidth,
        height: posterHeight,
      });

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png", 1)
      );

      if (!blob) return;

      const imageUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `Paradise-Available-Appointments-${availableAppointmentDate}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(imageUrl), 1000);
    } catch (error) {
      console.log("Available appointments image save error:", error);
      alert("لم يتم حفظ الصورة. جربي مرة ثانية.");
    } finally {
      if (posterClone?.parentNode) {
        posterClone.parentNode.removeChild(posterClone);
      }
    }
  };

  const renderAvailableAppointmentsPage = () => {
    const availableColor = "#9be05b";
    const bookedColor = "#f35b58";

    return withGreeting(
      <div
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top, #fffaf3 0%, #e8ddd0 45%, #cdb9a7 100%)",
          padding: "26px",
          fontFamily: "Arial",
          color: "#4b2e1f",
          textAlign: "center",
        }}
      >
        <button
          onClick={() => setScreen("dashboard")}
          style={{
            ...buttonStyle,
            backgroundColor: "#faf7f2",
            color: "#4b2e1f",
            border: "1px solid #d6c7b8",
            padding: "9px 18px",
            borderRadius: "16px",
            marginBottom: "18px",
          }}
        >
          Back
        </button>

        <h2 style={{ margin: "0 0 8px", fontSize: "30px", color: "#4b2e1f" }}>
          المواعيد المتاحة
        </h2>
        <p style={{ margin: "0 0 22px", color: "#7d6a5a", fontWeight: "700" }}>
         
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "22px",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(255,255,255,0.72)",
              border: "1px solid #d8c5b3",
              borderRadius: "18px",
              padding: "10px 14px",
              boxShadow: "0 10px 24px rgba(75,46,31,0.08)",
              fontWeight: "800",
            }}
          >
            التاريخ
            <input
              type="date"
              value={availableAppointmentDate}
              onChange={(event) => setAvailableAppointmentDate(event.target.value)}
              style={{
                border: "1px solid #d6c7b8",
                borderRadius: "12px",
                padding: "9px 12px",
                color: "#4b2e1f",
                background: "#fffaf3",
                fontWeight: "800",
              }}
            />
          </label>

          <button
            onClick={() => setAllAvailableAppointmentsStatus("available")}
            style={{
              ...buttonStyle,
              background: "linear-gradient(135deg, #7ac75a, #a9e96a)",
              color: "#3f332a",
              padding: "10px 16px",
              borderRadius: "16px",
            }}
          >
            الكل متاح
          </button>
          <button
            onClick={() => setAllAvailableAppointmentsStatus("booked")}
            style={{
              ...buttonStyle,
              background: "linear-gradient(135deg, #db4f4f, #ff6b63)",
              color: "white",
              padding: "10px 16px",
              borderRadius: "16px",
            }}
          >
            الكل محجوز
          </button>
        </div>

                <div style={{ height: "35px" }} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(320px, 540px) minmax(280px, 360px)",
            gap: "24px",
            alignItems: "start",
            justifyContent: "center",
          }}
        >
          <div
            ref={availablePosterRef}
            style={{
              width: "540px",
              maxWidth: "100%",
              aspectRatio: "540 / 744",
              position: "relative",
              overflow: "hidden",
              background: "#d9c8b8",
              boxShadow: "0 24px 55px rgba(75,46,31,0.22)",
            }}
          >
            <img
              src={availableAppointmentsTemplate}
              alt="المواعيد المتاحة"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />

            <div
              style={{
                position: "absolute",
                top: "8.6%",
                left: "12%",
                color: "#5b3b2c",
                fontSize: "17px",
                fontWeight: "800",
                direction: "rtl",
              }}
            >
              {formatAvailableDateForPoster(availableAppointmentDate)}
            </div>

            <div
              style={{
                position: "absolute",
                top: "29%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "42%",
                display: "grid",
                gap: "10px",
              }}
            >
              {availableAppointmentTimes.map((time) => {
                const isAvailable = availableAppointmentStatus[time] === "available";

                return (
                  <button
                    key={time}
                    onClick={() => toggleAvailableAppointmentStatus(time)}
                    style={{
                      border: "none",
                      background: "rgba(223,211,201,0.62)",
                      minHeight: "36px",
                      borderRadius: "3px",
                      padding: "4px 14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        width: "122px",
                        maxWidth: "100%",
                        borderRadius: "999px",
                        background: isAvailable
                          ? `linear-gradient(135deg, ${availableColor}, #b7f06b)`
                          : `linear-gradient(135deg, ${bookedColor}, #ff7068)`,
                        color: "#4b2e1f",
                        fontSize: "23px",
                        fontWeight: "900",
                        lineHeight: "28px",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.28)",
                      }}
                    >
                      {time}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.76)",
              border: "1px solid rgba(216,197,179,0.95)",
              borderRadius: "28px",
              padding: "22px",
              boxShadow: "0 20px 46px rgba(75,46,31,0.13)",
              textAlign: "center",
            }}
          >
            <h3 style={{ marginTop: 0, fontSize: "22px" }}>تعديل الأوقات</h3>
            <div style={{ display: "grid", gap: "10px", marginBottom: "18px" }}>
              {availableAppointmentTimes.map((time) => {
                const isAvailable = availableAppointmentStatus[time] === "available";

                return (
                  <button
                    key={time}
                    onClick={() => toggleAvailableAppointmentStatus(time)}
                    style={{
                      border: `1px solid ${isAvailable ? "#8fc96a" : "#db5d58"}`,
                      borderRadius: "16px",
                      padding: "12px 16px",
                      background: isAvailable ? "#f2ffe8" : "#fff0ef",
                      color: "#4b2e1f",
                      cursor: "pointer",
                      fontWeight: "900",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>{time}</span>
                    <span>{isAvailable ? "متاح" : "محجوز"}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={saveAvailableAppointmentsImage}
              style={{
                ...buttonStyle,
                width: "100%",
                background: "linear-gradient(135deg, #4b2e1f, #7a5a43)",
                color: "white",
                borderRadius: "18px",
                padding: "14px 18px",
                fontSize: "17px",
                boxShadow: "0 14px 30px rgba(75,46,31,0.20)",
              }}
            >
              حفظ الصورة
            </button>
          </div>
        </div>
      </div>
    );
  };

if (screen === "availableAppointments") {
    return renderAvailableAppointmentsPage();
  }

  if (screen === "printFrame") {
    return renderWelcomeBoardsPage();
  }

  if (screen === "clientProfile" && selectedClient) {
    return withGreeting(
      <div style={luxuryPageStyle}>
        <div
          style={{
            width: "620px",
            backgroundColor: "#ffffffe6",
            borderRadius: "36px",
            padding: "30px",
            boxShadow: "0 25px 65px rgba(75,46,31,0.18)",
            textAlign: "center",
            border: "1px solid #ffffffbf",
            backdropFilter: "blur(10px)",
            position: "relative",
          }}
        >
          <button
            onClick={() => setScreen("clients")}
            style={{
              position: "absolute",
              top: "18px",
              left: "18px",
              ...buttonStyle,
              backgroundColor: "#faf7f2",
              color: "#4b2e1f",
              padding: "8px 16px",
              border: "1px solid #d6c7b8",
              borderRadius: "16px",
              fontSize: "13px",
            }}
          >
            Back
          </button>

          <img
            src={logo}
            alt="logo"
            style={{
              width: "105px",
              marginBottom: "20px",
            }}
          />

          <div
            id={`card-${selectedClient.id}`}
            style={{
              width: "360px",
              height: "222px",
              margin: "0 auto 32px",
              borderRadius: "0px",
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 18px 38px rgba(75,46,31,0.22)",
              backgroundColor: "white",
            }}
          >
            <img
              src={getCardImage(selectedClient.visits)}
              alt="loyalty card"
              crossOrigin="anonymous"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "0px",
              }}
            />

            <div
              style={{
                position: "absolute",
                top: "14px",
                right: "14px",
                backgroundColor: "rgba(255,255,255,0.88)",
                padding: "7px 12px",
                borderRadius: "12px",
                fontWeight: "bold",
                fontSize: "14px",
                color: "#4b2e1f",
              }}
            >
              {selectedClient.name}
            </div>
          </div>

          <button
            onClick={() => sendWhatsApp(selectedClient)}
            style={{
              ...buttonStyle,
              width: "18%",
              margin: "0 auto 18px",
              display: "block",
              background: "linear-gradient(135deg, #1f9f54, #25D366)",
              color: "white",
              borderRadius: "18px",
              boxShadow: "0 12px 26px rgba(37,211,102,0.22)",
              fontSize: "15px",
            }}
          >
            WhatsApp + Copy Card
          </button>

          <h2
            style={{
              color: "#4b2e1f",
              fontSize: "30px",
              marginBottom: "8px",
            }}
          >
            {selectedClient.name}
          </h2>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              flexWrap: "wrap",
              marginBottom: "16px",
            }}
          >
            {profileBlacklist && (
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: "#2b1f1a",
                  color: "white",
                  padding: "7px 14px",
                  borderRadius: "999px",
                  fontSize: "13px",
                }}
              >
                ⚠ Blacklist
              </div>
            )}

            {profileFrame && (
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: "#cbb7a4",
                  color: "#4b2e1f",
                  padding: "7px 14px",
                  borderRadius: "999px",
                  fontSize: "13px",
                  fontWeight: "bold",
                }}
              >
                🖼️ اللوحة الترحيبية
              </div>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "12px",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                backgroundColor: "#faf7f2",
                borderRadius: "18px",
                padding: "16px",
              }}
            >
              <div style={{ color: "#8a7a68", fontSize: "13px" }}>رقم الجوال</div>
              <strong style={{ color: "#4b2e1f" }}>{selectedClient.phone}</strong>
            </div>

            <div
              style={{
                backgroundColor: "#faf7f2",
                borderRadius: "18px",
                padding: "16px",
              }}
            >
              <div style={{ color: "#8a7a68", fontSize: "13px" }}>الحي</div>
              <strong style={{ color: "#4b2e1f" }}>
                {selectedClient.address || "-"}
              </strong>
            </div>

            <div
              style={{
                backgroundColor: "#faf7f2",
                borderRadius: "18px",
                padding: "16px",
              }}
            >
              <div style={{ color: "#8a7a68", fontSize: "13px" }}>عدد الخدمات</div>
              <strong style={{ color: "#4b2e1f" }}>
                {selectedClient.visits}
              </strong>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "10px",
                }}
              >
                <button
                  onClick={() => addVisit(selectedClient.id)}
                  style={{
                    ...buttonStyle,
                    padding: "6px 10px",
                    borderRadius: "12px",
                    backgroundColor: "#4b2e1f",
                    color: "white",
                    fontSize: "12px",
                  }}
                >
                  +
                </button>
                <button
                  onClick={() => removeVisit(selectedClient.id)}
                  style={{
                    ...buttonStyle,
                    padding: "6px 10px",
                    borderRadius: "12px",
                    backgroundColor: "#d8c5b3",
                    color: "#4b2e1f",
                    fontSize: "12px",
                  }}
                >
                  -
                </button>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#faf7f2",
                borderRadius: "18px",
                padding: "16px",
              }}
            >
              <div style={{ color: "#8a7a68", fontSize: "13px" }}>الحالة</div>
              <strong style={{ color: "#4b2e1f" }}>
                {profileBlacklist ? "Blacklist" : "Active"}
              </strong>
            </div>
          </div>

          <div
            style={{
              width: "90%",
              margin: "0 auto 20px",
              background:
                "linear-gradient(135deg, #fffaf3, #f3e8df)",
              border: "1px solid #d6c7b8",
              borderRadius: "24px",
              padding: "18px",
              boxShadow: "0 10px 24px rgba(75,46,31,0.08)",
              textAlign: "right",
              direction: "rtl",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
                marginBottom: "14px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: "#4b2e1f",
                  fontSize: "18px",
                }}
              >
                سجل الخدمات
              </h3>

              <div
                style={{
                  backgroundColor: "#4b2e1f",
                  color: "white",
                  borderRadius: "999px",
                  padding: "8px 14px",
                  fontWeight: "bold",
                  fontSize: "13px",
                }}
              >
                إجمالي المدفوعات: {selectedClientServiceSummary.totalPaid} SAR
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "10px",
                marginBottom: "14px",
              }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "16px",
                  padding: "12px",
                  border: "1px solid #eadfd5",
                  textAlign: "center",
                }}
              >
                <div style={{ color: "#8a7a68", fontSize: "12px" }}>عدد الخدمات المسجلة</div>
                <strong style={{ color: "#4b2e1f", fontSize: "18px" }}>
                  {selectedClientServiceSummary.serviceHistory.length}
                </strong>
              </div>

              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "16px",
                  padding: "12px",
                  border: "1px solid #eadfd5",
                  textAlign: "center",
                }}
              >
                <div style={{ color: "#8a7a68", fontSize: "12px" }}>آخر زيارة</div>
                <strong style={{ color: "#4b2e1f", fontSize: "15px" }}>
                  {selectedClientServiceSummary.lastVisitDate || "-"}
                </strong>
              </div>

              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "16px",
                  padding: "12px",
                  border: "1px solid #eadfd5",
                  textAlign: "center",
                }}
              >
                <div style={{ color: "#8a7a68", fontSize: "12px" }}>عدد كرت الولاء</div>
                <strong style={{ color: "#4b2e1f", fontSize: "18px" }}>
                  {selectedClient.visits}
                </strong>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "8px",
                    marginTop: "10px",
                  }}
                >
                  <button
                    onClick={() => addVisit(selectedClient.id)}
                    style={{
                      ...buttonStyle,
                      background: "linear-gradient(135deg, #4b2e1f, #7a5a43)",
                      color: "white",
                      padding: "7px 12px",
                      fontSize: "12px",
                    }}
                  >
                    + خدمة
                  </button>

                  <button
                    onClick={() => removeVisit(selectedClient.id)}
                    style={{
                      ...buttonStyle,
                      backgroundColor: "#f3e8df",
                      color: "#4b2e1f",
                      padding: "7px 12px",
                      fontSize: "12px",
                      border: "1px solid #d6c7b8",
                    }}
                  >
                    - خدمة
                  </button>
                </div>
              </div>
            </div>

            {selectedClientServiceSummary.serviceHistory.length === 0 ? (
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "16px",
                  padding: "14px",
                  textAlign: "center",
                  color: "#8a7a68",
                  border: "1px solid #eadfd5",
                }}
              >
                لا توجد خدمات مرتبطة من جدول المواعيد حتى الآن
              </div>
            ) : (
              <div
                style={{
                  maxHeight: "230px",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {selectedClientServiceSummary.serviceHistory.map((service, index) => (
                  <div
                    key={`${service.date}-${service.serviceTime}-${index}`}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "90px 1fr 120px",
                      gap: "10px",
                      alignItems: "center",
                      backgroundColor: "white",
                      border: "1px solid #eadfd5",
                      borderRadius: "16px",
                      padding: "11px 12px",
                      color: "#4b2e1f",
                    }}
                  >
                    <strong>Service {index + 1}</strong>
                    <span
                      style={{
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {service.therapist}
                    </span>
                    <span
                      style={{
                        color: "#8a7a68",
                        fontSize: "13px",
                        textAlign: "left",
                        direction: "ltr",
                      }}
                    >
                      {service.date}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "15px",
              color: "#4b2e1f",
              fontWeight: "bold",
            }}
          >
            <input
              type="checkbox"
              checked={profileBlacklist}
              onChange={(e) => setProfileBlacklist(e.target.checked)}
              style={{
                width: "18px",
                height: "18px",
              }}
            />
            إضافة إلى Blacklist
          </label>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "15px",
              color: "#4b2e1f",
              fontWeight: "bold",
            }}
          >
            <input
              type="checkbox"
              checked={profileFrame}
              onChange={(e) => {
                setProfileFrame(e.target.checked);
                updateClientFrame(selectedClient.id, e.target.checked);
              }}
              style={{
                width: "18px",
                height: "18px",
              }}
            />
            اللوحة الترحيبية / Frame
          </label>

          <div
            style={{
              width: "90%",
              margin: "0 auto 18px",
              backgroundColor: "#fffaf3",
              border: "1px solid #d6c7b8",
              borderRadius: "22px",
              padding: "16px",
              boxShadow: "0 8px 20px rgba(75,46,31,0.07)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
                color: "#4b2e1f",
                fontWeight: "bold",
              }}
            >
              <span>العملاء المرشحين</span>

              <button
                onClick={addProfileReferral}
                style={{
                  ...buttonStyle,
                  backgroundColor: "#4b2e1f",
                  color: "white",
                  padding: "7px 12px",
                  fontSize: "12px",
                }}
              >
                + إضافة رقم
              </button>
            </div>

            {profileReferrals.length === 0 && (
              <div
                style={{
                  color: "#8a7a68",
                  fontSize: "13px",
                  marginBottom: "10px",
                }}
              >
                لا توجد أرقام مرشحة حتى الآن
              </div>
            )}

            {profileReferrals.map((referral) => (
              <div
                key={referral.id}
                style={{
                  display: "flex",
                  gap: "8px",
                  marginBottom: "8px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <input
                  placeholder="اسم المرشحة"
                  value={referral.name}
                  onChange={(e) =>
                    updateProfileReferral(referral.id, "name", e.target.value)
                  }
                  style={{
                    flex: "1",
                    minWidth: "130px",
                    padding: "10px",
                    borderRadius: "14px",
                    border: "1px solid #d6c7b8",
                    backgroundColor: "white",
                    outline: "none",
                    color: "#4b2e1f",
                  }}
                />

                <input
                  placeholder="رقم الجوال"
                  value={referral.phone}
                  onChange={(e) =>
                    updateProfileReferral(referral.id, "phone", e.target.value)
                  }
                  style={{
                    flex: "1",
                    minWidth: "130px",
                    padding: "10px",
                    borderRadius: "14px",
                    border: "1px solid #d6c7b8",
                    backgroundColor: "white",
                    outline: "none",
                    color: "#4b2e1f",
                  }}
                />

                <button
                  onClick={() => removeProfileReferral(referral.id)}
                  style={{
                    ...buttonStyle,
                    backgroundColor: "#f3e8df",
                    color: "#4b2e1f",
                    padding: "9px 12px",
                  }}
                >
                  حذف
                </button>
              </div>
            ))}
          </div>

          <textarea
            placeholder="اكتب الملاحظات هنا..."
            value={profileNotes}
            onChange={(e) => setProfileNotes(e.target.value)}
            style={{
              width: "90%",
              minHeight: "130px",
              padding: "16px",
              borderRadius: "20px",
              border: "1px solid #d6c7b8",
              backgroundColor: "#faf7f2",
              outline: "none",
              fontSize: "15px",
              color: "#4b2e1f",
              resize: "vertical",
              marginBottom: "18px",
              fontFamily: "Arial",
            }}
          />

          <div
            style={{
              display: "flex",
              width: "90%",
              margin: "0 auto",
              gap: "10px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            
            <button
              onClick={saveClientProfile}
              style={{
                ...buttonStyle,
                flex: "1",
                minWidth: "160px",
                backgroundColor: "#4b2e1f",
                color: "white",
                padding: "14px",
                fontSize: "16px",
              }}
            >
              حفظ البروفايل
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "clients") {
    return withGreeting(
      <div
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top left, #fffaf3, #efe4d7 42%, #d4bfae)",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "30px 22px",
          fontFamily: "Arial",
        }}
      >
        <div
          style={{
            width: "96%",
            maxWidth: "1240px",
            minHeight: "calc(100vh - 160px)",
            background: "rgba(255,255,255,0.76)",
            border: "1px solid rgba(255,255,255,0.88)",
            borderRadius: "34px",
            padding: "30px",
            boxShadow: "0 24px 60px rgba(75,46,31,0.14)",
            backdropFilter: "blur(14px)",
            textAlign: "center",
            position: "relative",
          }}
        >
          <button
            onClick={() => setScreen("dashboard")}
            style={{
              display: "none",
              position: "absolute",
              top: "18px",
              left: "18px",
              ...buttonStyle,
              backgroundColor: "#faf7f2",
              color: "#4b2e1f",
              padding: "8px 16px",
              border: "1px solid #d6c7b8",
              borderRadius: "16px",
              fontSize: "13px",
            }}
          >
            Back
          </button>

          <div
            style={{
              position: "absolute",
              top: "18px",
              right: "18px",
              ...buttonStyle,
              backgroundColor: "#faf7f2",
              color: "#4b2e1f",
              padding: "8px 16px",
              border: "1px solid #d6c7b8",
              borderRadius: "16px",
              fontSize: "13px",
              cursor: "default",
            }}
          >
            عدد العملاء: {clients.length}
          </div>

          <img
            src={logo}
            alt="logo"
            style={{
              width: "100px",
              marginBottom: "15px",
            }}
          />

          <h2
            style={{
              color: "#4b2e1f",
              marginBottom: "20px",
              fontSize: "28px",
            }}
          >
            عملائنا
          </h2>

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            <input
              placeholder="Search clients..."
              value={clientsSearch}
              onChange={(e) => setClientsSearch(e.target.value)}
              style={{
                flex: "1",
                minWidth: "230px",
                padding: "14px",
                borderRadius: "16px",
                border: "1px solid #d6c7b8",
                backgroundColor: "#faf7f2",
                outline: "none",
                fontSize: "15px",
              }}
            />

            
          </div>

          <div
            style={{
              overflowX: "auto",
              borderRadius: "20px",
              border: "1px solid #eadfd5",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                direction: "rtl",
                color: "#4b2e1f",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#cbb7a4",
                    color: "black",
                  }}
                >
                  <th style={{ padding: "14px" }}>#</th>
                  <th style={{ padding: "14px" }}>الاسم</th>
                  <th style={{ padding: "14px" }}>الرقم</th>
                  <th style={{ padding: "14px" }}>الحي</th>
                  <th style={{ padding: "14px" }}>عدد الخدمات</th>
                  <th style={{ padding: "14px" }}>اللوحة الترحيبية</th>
                  <th style={{ padding: "14px" }}>تعديل</th>
                  <th style={{ padding: "14px" }}>حذف</th>
                </tr>
              </thead>

              <tbody>
                {filteredClientsTable.slice(0, clientsVisibleCount).map((c, index) => (
                  <tr
                    key={c.id}
                    onClick={() => editingId !== c.id && openClientProfile(c)}
                    onMouseEnter={(e) => {
                      if (editingId !== c.id) e.currentTarget.style.backgroundColor = "#faf7f2";
                    }}
                    onMouseLeave={(e) => {
                      if (editingId !== c.id) e.currentTarget.style.backgroundColor = "white";
                    }}
                    style={{
                      borderBottom: "1px solid #eadfd5",
                      backgroundColor:
                        editingId === c.id ? "#faf7f2" : "white",
                      cursor: editingId === c.id ? "default" : "pointer",
                      transition: "0.2s ease",
                    }}
                  >
                    {editingId === c.id ? (
                      <>
                        <td style={{ padding: "12px", fontWeight: "bold" }}>
                          {index + 1}
                        </td>

                        <td style={{ padding: "12px" }}>
                          <input
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            style={{
                              ...editInputStyle,
                              width: "90%",
                            }}
                          />
                        </td>

                        <td style={{ padding: "12px" }}>
                          <input
                            value={editedPhone}
                            onChange={(e) => setEditedPhone(e.target.value)}
                            onBlur={() => setEditedPhone(formatSaudiPhoneForStorage(editedPhone))}
                            style={{
                              ...editInputStyle,
                              width: "90%",
                            }}
                          />
                        </td>

                        <td style={{ padding: "12px" }}>
                          <input
                            value={editedAddress}
                            onChange={(e) => setEditedAddress(e.target.value)}
                            style={{
                              ...editInputStyle,
                              width: "90%",
                            }}
                          />
                        </td>

                        <td style={{ padding: "12px", fontWeight: "bold" }}>
                          {c.visits}
                        </td>

                        <td style={{ padding: "12px" }}>
                          {c.frame ? "🖼️ نعم" : "-"}
                        </td>

                        <td style={{ padding: "12px" }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              saveEditClient(c.id);
                            }}
                            style={{
                              ...buttonStyle,
                              backgroundColor: "#4b2e1f",
                              color: "white",
                              padding: "8px 12px",
                              marginLeft: "6px",
                            }}
                          >
                            حفظ
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelEditClient();
                            }}
                            style={{
                              ...buttonStyle,
                              backgroundColor: "#d8c5b3",
                              color: "#4b2e1f",
                              padding: "8px 12px",
                            }}
                          >
                            إلغاء
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: "14px", fontWeight: "bold" }}>
                          {index + 1}
                        </td>

                        <td style={{ padding: "14px" }}>
                          <button
                            onClick={() => openClientProfile(c)}
                            style={{
                              border: "none",
                              backgroundColor: "transparent",
                              color: "#4b2e1f",
                              fontWeight: "bold",
                              cursor: "pointer",
                              fontSize: "15px",
                            }}
                          >
                            {c.blacklist && "⚠ "}
                            {c.notes && "📝 "}
                            {c.name}
                          </button>
                        </td>
                        <td style={{ padding: "14px" }}>{c.phone}</td>
                        <td style={{ padding: "14px" }}>
                          {c.address || "-"}
                        </td>
                        <td style={{ padding: "14px", fontWeight: "bold" }}>
                          {c.visits}
                        </td>
                        <td style={{ padding: "14px" }}>
                          {c.frame ? "🖼️ نعم" : "-"}
                        </td>
                        <td style={{ padding: "14px" }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditClient(c);
                            }}
                            style={{
                              ...buttonStyle,
                              backgroundColor: "#faf7f2",
                              color: "#4b2e1f",
                              border: "1px solid #d6c7b8",
                              padding: "8px 14px",
                            }}
                          >
                            تعديل
                          </button>
                        </td>
                        <td style={{ padding: "14px" }}>
  <button
    onClick={(e) => {
      e.stopPropagation();
      deleteClient(c);
    }}
    style={{
      ...buttonStyle,
      backgroundColor: "#faf7f2",
      color: "#4b2e1f",
      border: "1px solid #d6c7b8",
      padding: "8px 14px",
    }}
  >
    حذف
  </button>
</td>
                      </>
                    )}
                  </tr>
                ))}

                {filteredClientsTable.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        padding: "25px",
                        color: "#8a7a68",
                      }}
                    >
                      لا توجد نتائج
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {renderLoadMoreButtons(
            clientsVisibleCount,
            setClientsVisibleCount,
            filteredClientsTable.length
          )}
        </div>
      </div>
    );
  }

  return withGreeting(
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom right, #f6f1ea, #ebe1d3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          width: "96%",
          maxWidth: "1120px",
          background: "rgba(255,255,255,0.76)",
          border: "1px solid rgba(255,255,255,0.88)",
          borderRadius: "34px",
          padding: "30px",
          boxShadow: "0 24px 60px rgba(75,46,31,0.14)",
          backdropFilter: "blur(14px)",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* LOGO */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginBottom: "15px",
          }}
        >
          <img
            src={logo}
            alt="logo"
            style={{
              width: "95px",
              display: "block",
            }}
          />
        </div>


        <h2
          style={{
            color: "#4b2e1f",
            margin: "4px 0 22px",
            fontSize: "28px",
            fontWeight: "900",
          }}
        >
          كروت الولاء
        </h2>

        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-start",
            marginBottom: "10px",
          }}
        >
          <button
            onClick={() => setScreen("dashboard")}
            style={{
              display: "none",
              position: "absolute",
              top: "18px",
              left: "18px",
              ...buttonStyle,
              backgroundColor: "#faf7f2",
              color: "#4b2e1f",
              padding: "8px 16px",
              border: "1px solid #d6c7b8",
              borderRadius: "16px",
              fontSize: "13px",
            }}
          >
            Back
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "18px",
            flexWrap: "wrap",
          }}
        >
          <input
  type="number"
  placeholder="عدد الخدمات"
  value={loyaltyVisitsFilter}
  onChange={(e) => setLoyaltyVisitsFilter(e.target.value)}
  style={{
    ...inputStyle,
    flex: "0 0 150px",
    width: "150px",
    marginBottom: 0,
    backgroundColor: "#faf7f2",
    color: "#4b2e1f",
    border: "1px solid #d6c7b8",
    textAlign: "center",
    direction: "rtl",
  }}
/>
          {/* SEARCH */}
          <input
            placeholder="Search client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              ...inputStyle,
              flex: "1",
              minWidth: "260px",
              marginBottom: 0,
              backgroundColor: "#faf7f2",
              color: "#4b2e1f",
              border: "1px solid #d6c7b8",
            }}
          />

          {/* ADD BUTTON */}
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              ...buttonStyle,
              width: "180px",
              backgroundColor: "#faf7f2",
              color: "#4b2e1f",
              border: "1px solid #d6c7b8",
              marginBottom: 0,
              fontSize: "15px",
            }}
          >
            + Add Client
          </button>
        </div>

        {/* FORM */}
        {showForm && (
          <div
            style={{
              backgroundColor: "#faf7f2",
              padding: "18px",
              borderRadius: "22px",
              margin: "0 auto 24px",
              maxWidth: "620px",
            }}
          >
            <input
              placeholder="Client Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />

            <input
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={() => setPhone(formatSaudiPhoneForStorage(phone))}
              style={inputStyle}
            />

            <input
              placeholder="Address (Optional)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={inputStyle}
            />

            <button
              onClick={addClient}
              style={{
                ...buttonStyle,
                backgroundColor: "#4b2e1f",
                color: "white",
                width: "90%",
              }}
            >
              Save Client
            </button>
          </div>
        )}

        {/* LOYALTY CLIENTS LIST - LIGHT VIEW */}
        <div
          style={{
            width: "100%",
            maxWidth: "1180px",
            margin: "0 auto",
            border: "1px solid #eadfd5",
            borderRadius: "22px",
            overflow: "hidden",
            backgroundColor: "rgba(255,255,255,0.82)",
            boxShadow: "0 12px 28px rgba(75,46,31,0.08)",
            direction: "rtl",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr 1fr 120px 110px",
              gap: "10px",
              padding: "14px",
              backgroundColor: "#cbb7a4",
              color: "black",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            <div>الاسم</div>
            <div>رقم الجوال</div>
            <div>الحي</div>
            <div>عدد الخدمات</div>
            <div>عرض</div>
          </div>

          {filteredClients.slice(0, loyaltyVisibleCount).map((c) => {
            const isSelectedLoyaltyClient =
              String(selectedLoyaltyClientId) === String(c.id);

            return (
              <div key={c.id}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.2fr 1fr 1fr 120px 110px",
                    gap: "10px",
                    alignItems: "center",
                    padding: "12px 14px",
                    borderBottom: "1px solid #eadfd5",
                    color: "#4b2e1f",
                    textAlign: "center",
                    backgroundColor: isSelectedLoyaltyClient ? "#faf7f2" : "white",
                    transition: "0.2s ease",
                  }}
                >
                  <strong>{c.name || "-"}</strong>
                  <span>{c.phone || "-"}</span>
                  <span>{c.address || "-"}</span>
                  <strong>{c.visits || 0}</strong>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedLoyaltyClientId((prev) =>
                        String(prev) === String(c.id) ? null : c.id
                      )
                    }
                    style={{
                      ...buttonStyle,
                      backgroundColor: "#d8c5b3",
                      color: "black",
                      padding: "9px 16px",
                      borderRadius: "14px",
                    }}
                  >
                    عرض
                  </button>
                </div>

                {isSelectedLoyaltyClient && (
                  <div
                    style={{
                      padding: "20px 14px 26px",
                      borderBottom: "1px solid #eadfd5",
                      backgroundColor: "#fffaf6",
                    }}
                  >
                    {renderLoyaltyCard(c)}
                  </div>
                )}
              </div>
            );
          })}

          {filteredClients.length === 0 && (
            <div
              style={{
                padding: "24px",
                color: "#8a7a68",
                textAlign: "center",
              }}
            >
              لا توجد نتائج
            </div>
          )}
        </div>

        {renderLoadMoreButtons(
          loyaltyVisibleCount,
          setLoyaltyVisibleCount,
          filteredClients.length
        )}


      </div>
    </div>
  );
}

export default App;