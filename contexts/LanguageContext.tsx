import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "fr" | "en" | "es" | "de" | "it" | "pt";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const translations = {
  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.calendar": "Calendrier",
    "nav.journal": "Journal",
    "nav.profile": "Profil",

    // Home Screen
    "home.greeting": "Bonjour Marie ! 👋",
    "home.subtitle": "Voici un aperçu de votre famille",
    "home.children": "Vos enfants",
    "home.quickActions": "Actions rapides",
    "home.upcomingEvents": "Événements à venir",
    "home.recentActivities": "Activités récentes",
    "home.quickAdd": "Ajouter rapidement",
    "home.seeAll": "Voir tout",

    // Quick Actions
    "actions.messages": "Messages",
    "actions.expenses": "Dépenses",
    "actions.documents": "Documents",
    "actions.memory": "Souvenir",
    "actions.event": "Événement",
    "actions.expense": "Dépense",

    // Messages
    "messages.title": "Messages",
    "messages.subtitle": "Communiquez avec la famille",
    "messages.search": "Rechercher une conversation...",
    "messages.online": "En ligne",
    "messages.offline": "Hors ligne",
    "messages.typeMessage": "Tapez votre message...",
    "messages.needPermission":
      "Nous avons besoin de votre permission pour afficher la caméra",
    "messages.grantPermission": "Accorder la permission",
    "messages.flipCamera": "Retourner la caméra",

    // Expenses
    "expenses.title": "Dépenses",
    "expenses.subtitle": "Gérer les frais partagés",
    "expenses.newExpense": "Nouvelle dépense",
    "expenses.total": "Total",
    "expenses.thisMonth": "Ce mois",
    "expenses.shared": "Partagées",
    "expenses.search": "Rechercher une dépense...",
    "expenses.add": "Ajouter",
    "expenses.cancel": "Annuler",
    "expenses.title.placeholder": "Titre de la dépense",
    "expenses.amount.placeholder": "Montant (€)",
    "expenses.description.placeholder": "Description (optionnel)",
    "expenses.paidBy": "Payé par",
    "expenses.receiptAvailable": "Reçu disponible",

    // Documents
    "documents.title": "Documents",
    "documents.subtitle": "Fichiers partagés de la famille",
    "documents.search": "Rechercher un document...",
    "documents.storage": "Stockage",
    "documents.uploadedBy": "Par",

    // Calendar
    "calendar.title": "Calendrier Partagé",
    "calendar.loading": "Chargement du calendrier...",
    "calendar.error": "Erreur",
    "calendar.retry": "Réessayer",
    "calendar.noChild": "Aucun enfant trouvé",
    "calendar.noChildText":
      "Ajoutez un enfant dans votre profil pour commencer à utiliser le calendrier.",
    "calendar.goToProfile": "Aller au profil",
    "calendar.eventsFor": "Événements du",
    "calendar.upcoming": "Événements à venir",
    "calendar.noUpcoming": "Aucun événement à venir",
    "calendar.addEvent": "Ajouter un événement",
    "calendar.eventsThisMonth": "Événements ce mois",
    "calendar.guardsPlanned": "Gardes planifiées",
    "calendar.appointments": "Rendez-vous",
    "calendar.allDay": "Toute la journée",
    "calendar.deleteEvent": "Supprimer l'événement",
    "calendar.deleteConfirm":
      "Êtes-vous sûr de vouloir supprimer cet événement ?",
    "calendar.delete": "Supprimer",
    "calendar.addFeature": "Ajout d'événement bientôt disponible",
    "calendar.feature": "Fonctionnalité",

    // Journal
    "journal.title": "Journal d'Emma",
    "journal.subtitle": "Partagez les moments précieux",
    "journal.newEntry": "Nouvelle entrée",
    "journal.memories": "Souvenirs",
    "journal.photos": "Photos",
    "journal.placeholder": "Racontez un moment spécial avec Emma...",
    "journal.addPhoto": "Ajouter photo",
    "journal.publish": "Publier",
    "journal.like": "J'aime",
    "journal.favorite": "Favori",
    "journal.comment": "commentaire",
    "journal.comments": "commentaires",
    "journal.addComment": "Ajouter un commentaire...",

    // Profile
    "profile.title": "Profil",
    "profile.subtitle": "Gerer son profil artistique",
    "profile.calendarColor": "Couleur du calendrier",
    "profile.language": "Langue",
    "profile.theme": "Thème",
    "profile.privacy": "Confidentialité",
    "profile.enabled": "Activées",
    "profile.french": "Français",
    "profile.light": "Clair",
    "profile.manage": "Gérer",
    "profile.professeur": "Professeur",
    "profile.settings": "Paramètres profil",

    // Settings
    "settings.notifications.title": "Notifications",
    "settings.notifications.subtitle": "Gérer vos préférences",
    "settings.language.title": "Langue",
    "settings.language.subtitle": "Choisir la langue de l'application",
    "settings.theme.title": "Thème",
    "settings.theme.subtitle": "Personnaliser l'apparence",
    "settings.privacy.title": "Confidentialité",
    "settings.privacy.subtitle": "Gérer vos données personnelles",

    // Common
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
    "common.delete": "Supprimer",
    "common.edit": "Modifier",
    "common.add": "Ajouter",
    "common.search": "Rechercher",
    "common.all": "Tous",
    "common.years": "ans",

    // Sauvegardes
    "saves.library": "Ma bibliothèque",
    "saves.favorites": "Mes favoris",
    "saves.empty": "Aucun favori",
    "saves.emptyDesc": "Sauvegardez des parcours pour les retrouver ici",
    "saves.progression": "Ta progression",
    "saves.lessons": "leçons",
    "saves.lessonsOn": "sur",
    "saves.completed": "terminées",
    "saves.resume": "Reprendre",
    "saves.inProgress": "En cours",
    "saves.content": "Contenu du parcours",
    "saves.lessonsCompleted": "leçons complétées",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.calendar": "Calendar",
    "nav.journal": "Journal",
    "nav.profile": "Profile",

    // Home Screen
    "home.greeting": "Hello Marie! 👋",
    "home.subtitle": "Here's an overview of your family",
    "home.children": "Your children",
    "home.quickActions": "Quick actions",
    "home.upcomingEvents": "Upcoming events",
    "home.recentActivities": "Recent activities",
    "home.quickAdd": "Quick add",
    "home.seeAll": "See all",

    // Quick Actions
    "actions.messages": "Messages",
    "actions.expenses": "Expenses",
    "actions.documents": "Documents",
    "actions.memory": "Memory",
    "actions.event": "Event",
    "actions.expense": "Expense",

    // Messages
    "messages.title": "Messages",
    "messages.subtitle": "Communicate with family",
    "messages.search": "Search conversation...",
    "messages.online": "Online",
    "messages.offline": "Offline",
    "messages.typeMessage": "Type your message...",
    "messages.needPermission": "We need your permission to show the camera",
    "messages.grantPermission": "Grant permission",
    "messages.flipCamera": "Flip camera",

    // Expenses
    "expenses.title": "Expenses",
    "expenses.subtitle": "Manage shared costs",
    "expenses.newExpense": "New expense",
    "expenses.total": "Total",
    "expenses.thisMonth": "This month",
    "expenses.shared": "Shared",
    "expenses.search": "Search expense...",
    "expenses.add": "Add",
    "expenses.cancel": "Cancel",
    "expenses.title.placeholder": "Expense title",
    "expenses.amount.placeholder": "Amount (€)",
    "expenses.description.placeholder": "Description (optional)",
    "expenses.paidBy": "Paid by",
    "expenses.receiptAvailable": "Receipt available",

    // Documents
    "documents.title": "Documents",
    "documents.subtitle": "Family shared files",
    "documents.search": "Search document...",
    "documents.storage": "Storage",
    "documents.uploadedBy": "By",

    // Calendar
    "calendar.title": "Shared Calendar",
    "calendar.loading": "Loading calendar...",
    "calendar.error": "Error",
    "calendar.retry": "Retry",
    "calendar.noChild": "No children found",
    "calendar.noChildText":
      "Add a child in your profile to start using the calendar.",
    "calendar.goToProfile": "Go to profile",
    "calendar.eventsFor": "Events for",
    "calendar.upcoming": "Upcoming events",
    "calendar.noUpcoming": "No upcoming events",
    "calendar.addEvent": "Add event",
    "calendar.eventsThisMonth": "Events this month",
    "calendar.guardsPlanned": "Guards planned",
    "calendar.appointments": "Appointments",
    "calendar.allDay": "All day",
    "calendar.deleteEvent": "Delete event",
    "calendar.deleteConfirm": "Are you sure you want to delete this event?",
    "calendar.delete": "Delete",
    "calendar.addFeature": "Add event feature coming soon",
    "calendar.feature": "Feature",
    "calendar.views.day": "Day",
    "calendar.views.week": "Week",
    "calendar.views.month": "Month",
    "calendar.views.year": "Year",
    "calendar.months.0": "January",
    "calendar.months.1": "February",
    "calendar.months.2": "March",
    "calendar.months.3": "April",
    "calendar.months.4": "May",
    "calendar.months.5": "June",
    "calendar.months.6": "July",
    "calendar.months.7": "August",
    "calendar.months.8": "September",
    "calendar.months.9": "October",
    "calendar.months.10": "November",
    "calendar.months.11": "December",
    "calendar.days.0": "M",
    "calendar.days.1": "T",
    "calendar.days.2": "W",
    "calendar.days.3": "T",
    "calendar.days.4": "F",
    "calendar.days.5": "S",
    "calendar.days.6": "S",

    // Journal
    "journal.title": "Emma's Journal",
    "journal.subtitle": "Share precious moments",
    "journal.newEntry": "New entry",
    "journal.memories": "Memories",
    "journal.photos": "Photos",
    "journal.placeholder": "Tell about a special moment with Emma...",
    "journal.addPhoto": "Add photo",
    "journal.publish": "Publish",
    "journal.like": "Like",
    "journal.favorite": "Favorite",
    "journal.comment": "comment",
    "journal.comments": "comments",
    "journal.addComment": "Add a comment...",

    // Profile
    "profile.title": "Profile & Family",
    "profile.subtitle": "Manage family members",
    "profile.parents": "Parents",
    "profile.children": "Children",
    "profile.settings": "Settings",
    "profile.newChild": "New child",
    "profile.childName": "Child's first name",
    "profile.age": "Age",
    "profile.calendarColor": "Calendar color",
    "profile.notifications": "Notifications",
    "profile.language": "Language",
    "profile.theme": "Theme",
    "profile.privacy": "Privacy",
    "profile.enabled": "Enabled",
    "profile.french": "French",
    "profile.light": "Light",
    "profile.manage": "Manage",

    // Settings
    "settings.notifications.title": "Notifications",
    "settings.notifications.subtitle": "Manage your preferences",
    "settings.language.title": "Language",
    "settings.language.subtitle": "Choose app language",
    "settings.theme.title": "Theme",
    "settings.theme.subtitle": "Customize appearance",
    "settings.privacy.title": "Privacy",
    "settings.privacy.subtitle": "Manage your personal data",

    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.add": "Add",
    "common.search": "Search",
    "common.all": "All",
    "common.years": "years old",

    // Saves
    "saves.library": "My library",
    "saves.favorites": "My favorites",
    "saves.empty": "No favorites",
    "saves.emptyDesc": "Save courses to find them here",
    "saves.progression": "Your progress",
    "saves.lessons": "lessons",
    "saves.lessonsOn": "out of",
    "saves.completed": "completed",
    "saves.resume": "Resume",
    "saves.inProgress": "In progress",
    "saves.content": "Course content",
    "saves.lessonsCompleted": "lessons completed",
  },
  es: {
    // Navigation
    "nav.home": "Inicio",
    "nav.calendar": "Calendario",
    "nav.journal": "Diario",
    "nav.profile": "Perfil",

    // Home Screen
    "home.greeting": "¡Hola Marie! 👋",
    "home.subtitle": "Aquí tienes una vista general de tu familia",
    "home.children": "Tus hijos",
    "home.quickActions": "Acciones rápidas",
    "home.upcomingEvents": "Próximos eventos",
    "home.recentActivities": "Actividades recientes",
    "home.quickAdd": "Añadir rápidamente",
    "home.seeAll": "Ver todo",

    // Quick Actions
    "actions.messages": "Mensajes",
    "actions.expenses": "Gastos",
    "actions.documents": "Documentos",
    "actions.memory": "Recuerdo",
    "actions.event": "Evento",
    "actions.expense": "Gasto",

    // Messages
    "messages.title": "Mensajes",
    "messages.subtitle": "Comunícate con la familia",
    "messages.search": "Buscar conversación...",
    "messages.online": "En línea",
    "messages.offline": "Desconectado",
    "messages.typeMessage": "Escribe tu mensaje...",
    "messages.needPermission": "Necesitamos tu permiso para mostrar la cámara",
    "messages.grantPermission": "Conceder permiso",
    "messages.flipCamera": "Voltear cámara",

    // Profile
    "profile.title": "Perfil y Familia",
    "profile.subtitle": "Gestionar miembros de la familia",
    "profile.parents": "Padres",
    "profile.children": "Niños",

    // Calendar
    "calendar.title": "Calendario Compartido",
    "calendar.months.0": "Enero",
    "calendar.months.1": "Febrero",
    "calendar.months.2": "Marzo",
    "calendar.months.3": "Abril",
    "calendar.months.4": "Mayo",
    "calendar.months.5": "Junio",
    "calendar.months.6": "Julio",
    "calendar.months.7": "Agosto",
    "calendar.months.8": "Septiembre",
    "calendar.months.9": "Octubre",
    "calendar.months.10": "Noviembre",
    "calendar.months.11": "Diciembre",
    "calendar.days.0": "L",
    "calendar.days.1": "M",
    "calendar.days.2": "X",
    "calendar.days.3": "J",
    "calendar.days.4": "V",
    "calendar.days.5": "S",
    "calendar.days.6": "D",

    // Journal
    "journal.title": "Diario de Emma",

    // Common
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.years": "años",
  },
  de: {
    // Navigation
    "nav.home": "Startseite",
    "nav.calendar": "Kalender",
    "nav.journal": "Tagebuch",
    "nav.profile": "Profil",

    // Home Screen
    "home.greeting": "Hallo Marie! 👋",
    "home.subtitle": "Hier ist eine Übersicht über Ihre Familie",
    "home.children": "Ihre Kinder",
    "home.quickActions": "Schnellaktionen",
    "home.upcomingEvents": "Kommende Ereignisse",
    "home.recentActivities": "Letzte Aktivitäten",
    "home.quickAdd": "Schnell hinzufügen",
    "home.seeAll": "Alle anzeigen",

    // Profile
    "profile.title": "Profil & Familie",
    "profile.subtitle": "Familienmitglieder verwalten",
    "profile.parents": "Eltern",
    "profile.children": "Kinder",
    "profile.settings": "Einstellungen",
    "profile.language": "Sprache",

    // Calendar
    "calendar.title": "Geteilter Kalender",
    "calendar.months.0": "Januar",
    "calendar.months.1": "Februar",
    "calendar.months.2": "März",
    "calendar.months.3": "April",
    "calendar.months.4": "Mai",
    "calendar.months.5": "Juni",
    "calendar.months.6": "Juli",
    "calendar.months.7": "August",
    "calendar.months.8": "September",
    "calendar.months.9": "Oktober",
    "calendar.months.10": "November",
    "calendar.months.11": "Dezember",
    "calendar.days.0": "M",
    "calendar.days.1": "D",
    "calendar.days.2": "M",
    "calendar.days.3": "D",
    "calendar.days.4": "F",
    "calendar.days.5": "S",
    "calendar.days.6": "S",

    // Journal
    "journal.title": "Emmas Tagebuch",

    // Common
    "common.save": "Speichern",
    "common.cancel": "Abbrechen",
    "common.years": "Jahre alt",
  },
  it: {
    // Navigation
    "nav.home": "Casa",
    "nav.calendar": "Calendario",
    "nav.journal": "Diario",
    "nav.profile": "Profilo",

    // Home Screen
    "home.greeting": "Ciao Marie! 👋",
    "home.subtitle": "Ecco una panoramica della tua famiglia",
    "home.children": "I tuoi bambini",
    "home.quickActions": "Azioni rapide",
    "home.upcomingEvents": "Prossimi eventi",
    "home.recentActivities": "Attività recenti",
    "home.quickAdd": "Aggiungi rapidamente",
    "home.seeAll": "Vedi tutto",

    // Profile
    "profile.title": "Profilo e Famiglia",
    "profile.subtitle": "Gestisci i membri della famiglia",
    "profile.parents": "Genitori",
    "profile.children": "Bambini",
    "profile.settings": "Impostazioni",
    "profile.language": "Lingua",

    // Calendar
    "calendar.title": "Calendario Condiviso",
    "calendar.months.0": "Gennaio",
    "calendar.months.1": "Febbraio",
    "calendar.months.2": "Marzo",
    "calendar.months.3": "Aprile",
    "calendar.months.4": "Maggio",
    "calendar.months.5": "Giugno",
    "calendar.months.6": "Luglio",
    "calendar.months.7": "Agosto",
    "calendar.months.8": "Settembre",
    "calendar.months.9": "Ottobre",
    "calendar.months.10": "Novembre",
    "calendar.months.11": "Dicembre",
    "calendar.days.0": "L",
    "calendar.days.1": "M",
    "calendar.days.2": "M",
    "calendar.days.3": "G",
    "calendar.days.4": "V",
    "calendar.days.5": "S",
    "calendar.days.6": "D",

    // Journal
    "journal.title": "Diario di Emma",

    // Common
    "common.save": "Salva",
    "common.cancel": "Annulla",
    "common.years": "anni",
  },
  pt: {
    // Navigation
    "nav.home": "Início",
    "nav.calendar": "Calendário",
    "nav.journal": "Diário",
    "nav.profile": "Perfil",

    // Home Screen
    "home.greeting": "Olá Marie! 👋",
    "home.subtitle": "Aqui está uma visão geral da sua família",
    "home.children": "Seus filhos",
    "home.quickActions": "Ações rápidas",
    "home.upcomingEvents": "Próximos eventos",
    "home.recentActivities": "Atividades recentes",
    "home.quickAdd": "Adicionar rapidamente",
    "home.seeAll": "Ver tudo",

    // Profile
    "profile.title": "Perfil e Família",
    "profile.subtitle": "Gerenciar membros da família",
    "profile.parents": "Pais",
    "profile.children": "Crianças",
    "profile.settings": "Configurações",
    "profile.language": "Idioma",

    // Calendar
    "calendar.views.day": "Dia",
    "calendar.views.week": "Semana",
    "calendar.views.month": "Mês",
    "calendar.views.year": "Ano",
    "calendar.title": "Calendário Compartilhado",
    "calendar.months.1": "Fevereiro",
    "calendar.months.2": "Março",
    "calendar.months.3": "Abril",
    "calendar.months.4": "Maio",
    "calendar.months.5": "Junho",
    "calendar.months.6": "Julho",
    "calendar.months.7": "Agosto",
    "calendar.months.8": "Setembro",
    "calendar.months.9": "Outubro",
    "calendar.months.10": "Novembro",
    "calendar.months.11": "Dezembro",
    "calendar.days.0": "S",
    "calendar.days.1": "T",
    "calendar.days.2": "Q",
    "calendar.days.3": "Q",
    "calendar.days.4": "S",
    "calendar.days.5": "S",
    "calendar.days.6": "D",

    // Journal
    "journal.title": "Diário da Emma",

    // Common
    "common.save": "Salvar",
    "common.cancel": "Cancelar",
    "common.years": "anos",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr");

  useEffect(() => {
    // Load saved language from storage
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("app_language");
        if (savedLanguage && translations[savedLanguage as Language]) {
          setLanguageState(savedLanguage as Language);
        }
      } catch (error) {
        throw error;
      }
    };
    loadLanguage();
  }, []);

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem("app_language", lang);
      setLanguageState(lang);
    } catch (error) {
      throw error;
    }
  };

  const t = (key: string): string => {
    return (
      translations[language]?.[
        key as keyof (typeof translations)[typeof language]
      ] || key
    );
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
