import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const C = {
  navy: "#103149",
  navyDeep: "#0A1E2E",
  yellow: "#F6C04F",
  bg: "#EEF5FB",
  card: "#FFFFFF",
  border: "#E5EDF4",
  textPrimary: "#0E2B45",
  textMuted: "#6B7280",
  softGray: "#9AA6B2",
  white: "#FFFFFF",
};

// ─── Legal content ────────────────────────────────────────────────────────────

type Section = { title: string; body: string };

const LEGAL_CONTENT: Record<string, { heading: string; updated: string; sections: Section[] }> = {
  mentions: {
    heading: "Mentions légales",
    updated: "Dernière mise à jour : 1er janvier 2025",
    sections: [
      {
        title: "Éditeur du site",
        body:
          "L'application Djalico est éditée par Djalico SAS, société par actions simplifiée au capital de 10 000 €, immatriculée au Registre du Commerce et des Sociétés de Paris sous le numéro 123 456 789.\n\nSiège social : 12 rue de la Musique, 75001 Paris, France\nTéléphone : +33 1 23 45 67 89\nE-mail : contact@djalico.com",
      },
      {
        title: "Directeur de la publication",
        body:
          "Le directeur de la publication est le représentant légal de Djalico SAS.",
      },
      {
        title: "Hébergement",
        body:
          "L'application est hébergée par :\nSupabase Inc.\n970 Toa Payoh North, #07-04, Singapore 318992\nhttps://supabase.com\n\nLes contenus vidéo sont hébergés sur les serveurs de Djalico et diffusés via un CDN tiers.",
      },
      {
        title: "Propriété intellectuelle",
        body:
          "L'ensemble des contenus présents sur l'application (textes, images, vidéos, logotypes, icônes) sont protégés par le droit d'auteur et restent la propriété exclusive de Djalico SAS ou de ses partenaires. Toute reproduction, représentation, modification ou adaptation, même partielle, est interdite sans l'accord préalable écrit de Djalico SAS.",
      },
      {
        title: "Limitation de responsabilité",
        body:
          "Djalico SAS s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur l'application. Cependant, Djalico SAS ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition. Djalico SAS décline toute responsabilité pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur l'application.",
      },
      {
        title: "Droit applicable",
        body:
          "Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.",
      },
    ],
  },

  cgu: {
    heading: "Conditions Générales d'Utilisation",
    updated: "Dernière mise à jour : 1er janvier 2025",
    sections: [
      {
        title: "1. Objet",
        body:
          "Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités et conditions dans lesquelles Djalico SAS met à disposition de ses utilisateurs l'application mobile Djalico, plateforme d'éducation musicale en ligne.",
      },
      {
        title: "2. Accès au service",
        body:
          "L'accès à l'application Djalico est réservé aux personnes physiques majeures ou aux mineurs disposant de l'autorisation parentale. La création d'un compte est obligatoire pour accéder aux fonctionnalités de l'application. L'utilisateur s'engage à fournir des informations exactes, complètes et à jour lors de son inscription.",
      },
      {
        title: "3. Compte utilisateur",
        body:
          "Chaque utilisateur est responsable de la confidentialité de ses identifiants de connexion. En cas de perte ou de compromission de son mot de passe, l'utilisateur doit en informer immédiatement Djalico SAS à l'adresse contact@djalico.com. Djalico SAS ne saurait être tenu responsable de toute utilisation frauduleuse du compte résultant d'un manquement de l'utilisateur à ses obligations de confidentialité.",
      },
      {
        title: "4. Utilisation du service",
        body:
          "L'utilisateur s'engage à utiliser l'application conformément aux lois en vigueur et aux présentes CGU. Il est notamment interdit de :\n• Reproduire, copier, vendre ou revendre tout ou partie du contenu de l'application sans autorisation préalable ;\n• Utiliser l'application à des fins illicites, frauduleuses ou malveillantes ;\n• Tenter de pirater, d'accéder sans autorisation aux systèmes informatiques de Djalico SAS ;\n• Perturber le bon fonctionnement de l'application.",
      },
      {
        title: "5. Contenu pédagogique",
        body:
          "Les cours, vidéos, parcours et ressources pédagogiques disponibles sur Djalico sont protégés par le droit d'auteur et sont destinés à un usage personnel et non commercial. L'utilisateur s'interdit de les partager, redistribuer ou exploiter commercialement sans accord écrit préalable de Djalico SAS.",
      },
      {
        title: "6. Abonnements et paiements",
        body:
          "Certaines fonctionnalités de l'application sont accessibles via un abonnement payant. Les tarifs, modalités de paiement et conditions de résiliation sont précisés lors du processus d'abonnement. Les abonnements sont renouvelables automatiquement sauf résiliation par l'utilisateur avant la date de renouvellement.",
      },
      {
        title: "7. Suspension et résiliation",
        body:
          "Djalico SAS se réserve le droit de suspendre ou de supprimer le compte d'un utilisateur en cas de violation des présentes CGU, sans préavis ni indemnité. L'utilisateur peut supprimer son compte à tout moment en contactant le support à l'adresse contact@djalico.com.",
      },
      {
        title: "8. Modification des CGU",
        body:
          "Djalico SAS se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification substantielle par notification dans l'application. L'utilisation continue de l'application après modification vaut acceptation des nouvelles CGU.",
      },
      {
        title: "9. Droit applicable et juridiction",
        body:
          "Les présentes CGU sont soumises au droit français. Tout litige relatif à leur interprétation ou leur exécution relève de la compétence exclusive des tribunaux du ressort de la Cour d'appel de Paris.",
      },
    ],
  },

  privacy: {
    heading: "Politique de confidentialité",
    updated: "Dernière mise à jour : 1er janvier 2025",
    sections: [
      {
        title: "1. Responsable du traitement",
        body:
          "Djalico SAS, dont le siège social est situé au 12 rue de la Musique, 75001 Paris, est responsable du traitement de vos données personnelles au sens du Règlement Général sur la Protection des Données (RGPD).\n\nContact DPO : dpo@djalico.com",
      },
      {
        title: "2. Données collectées",
        body:
          "Lors de votre utilisation de l'application, nous collectons les données suivantes :\n• Données d'identification : nom, adresse e-mail, photo de profil ;\n• Données de connexion : adresse IP, identifiant de session, date et heure de connexion ;\n• Données d'utilisation : cours consultés, vidéos regardées, progression pédagogique, favoris ;\n• Données de paiement : traitées par notre prestataire de paiement sécurisé (Stripe) — Djalico ne conserve pas vos données bancaires.",
      },
      {
        title: "3. Finalités et bases légales",
        body:
          "Vos données sont traitées pour les finalités suivantes :\n• Création et gestion de votre compte (base légale : exécution du contrat) ;\n• Fourniture des services pédagogiques (base légale : exécution du contrat) ;\n• Personnalisation de votre expérience d'apprentissage (base légale : intérêt légitime) ;\n• Envoi de communications relatives à votre compte et à nos services (base légale : consentement ou intérêt légitime) ;\n• Amélioration de nos services via des analyses statistiques anonymisées (base légale : intérêt légitime) ;\n• Respect de nos obligations légales (base légale : obligation légale).",
      },
      {
        title: "4. Conservation des données",
        body:
          "Vos données personnelles sont conservées :\n• Données de compte : pendant la durée de votre abonnement et 3 ans après sa résiliation ;\n• Données de paiement : 5 ans conformément aux obligations légales comptables ;\n• Données de connexion : 12 mois conformément aux obligations légales.\n\nPassé ces délais, vos données sont supprimées ou anonymisées.",
      },
      {
        title: "5. Partage des données",
        body:
          "Vos données peuvent être partagées avec :\n• Nos prestataires techniques (hébergement, CDN, paiement) dans le cadre de l'exécution du service ;\n• Les autorités compétentes en cas d'obligation légale.\n\nNous ne vendons jamais vos données personnelles à des tiers.",
      },
      {
        title: "6. Transferts hors UE",
        body:
          "Certains de nos prestataires peuvent traiter vos données en dehors de l'Union européenne. Ces transferts sont encadrés par des garanties appropriées (clauses contractuelles types de la Commission européenne ou décision d'adéquation).",
      },
      {
        title: "7. Vos droits",
        body:
          "Conformément au RGPD, vous disposez des droits suivants :\n• Droit d'accès à vos données ;\n• Droit de rectification de vos données ;\n• Droit à l'effacement (« droit à l'oubli ») ;\n• Droit à la limitation du traitement ;\n• Droit à la portabilité de vos données ;\n• Droit d'opposition au traitement ;\n• Droit de retirer votre consentement à tout moment.\n\nPour exercer ces droits, contactez-nous à l'adresse : dpo@djalico.com\n\nVous disposez également du droit d'introduire une réclamation auprès de la CNIL (www.cnil.fr).",
      },
      {
        title: "8. Sécurité",
        body:
          "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, altération, divulgation ou destruction. L'accès à vos données est limité aux personnes habilitées qui en ont besoin dans le cadre de leurs fonctions.",
      },
      {
        title: "9. Cookies et traceurs",
        body:
          "L'application mobile n'utilise pas de cookies au sens traditionnel du terme. Des identifiants techniques (tokens de session) sont utilisés pour maintenir votre connexion et sont stockés de manière sécurisée sur votre appareil.",
      },
      {
        title: "10. Modifications",
        body:
          "Cette politique de confidentialité peut être mise à jour pour refléter les évolutions légales ou de nos pratiques. Toute modification substantielle vous sera notifiée dans l'application ou par e-mail.",
      },
    ],
  },

  cookies: {
    heading: "Politique de cookies",
    updated: "Dernière mise à jour : 1er janvier 2025",
    sections: [
      {
        title: "1. Qu'est-ce qu'un cookie ?",
        body:
          "Un cookie est un petit fichier texte déposé sur votre appareil (smartphone, tablette) lors de la visite d'un site ou de l'utilisation d'une application. Il permet de mémoriser des informations relatives à votre navigation afin de vous offrir une expérience personnalisée.",
      },
      {
        title: "2. Cookies utilisés par Djalico",
        body:
          "L'application Djalico n'utilise pas de cookies au sens classique du terme. En tant qu'application mobile native, elle recourt à des mécanismes de stockage local équivalents :\n\n• Token de session (stockage sécurisé) : permet de maintenir votre connexion entre deux ouvertures de l'application. Ce token est chiffré et stocké dans le trousseau sécurisé de votre appareil.\n\n• Préférences utilisateur (AsyncStorage) : mémorise vos réglages locaux tels que la langue choisie, afin de ne pas les redemander à chaque démarrage.\n\n• Cache de requêtes (TanStack Query) : conserve temporairement en mémoire les données récupérées depuis notre API pour accélérer l'affichage et réduire la consommation de données.",
      },
      {
        title: "3. Traceurs analytiques",
        body:
          "Nous pouvons utiliser des outils d'analyse anonymisés pour mesurer l'audience et améliorer l'application (nombre de sessions, écrans consultés, taux de complétion des cours). Ces données sont agrégées et ne permettent pas de vous identifier personnellement.",
      },
      {
        title: "4. Cookies tiers",
        body:
          "Certains contenus intégrés dans l'application (notamment les vidéos YouTube) peuvent déposer des cookies ou traceurs tiers soumis à leur propre politique de confidentialité. Nous vous invitons à consulter la politique de confidentialité de Google/YouTube pour en savoir plus.",
      },
      {
        title: "5. Durée de conservation",
        body:
          "• Token de session : supprimé lors de la déconnexion ou après 30 jours d'inactivité.\n• Préférences locales : conservées jusqu'à la désinstallation de l'application ou réinitialisation manuelle.\n• Cache de requêtes : conservé en mémoire vive uniquement, effacé à la fermeture de l'application.",
      },
      {
        title: "6. Gestion et suppression",
        body:
          "Vous pouvez à tout moment :\n• Vous déconnecter de l'application pour supprimer votre token de session ;\n• Désinstaller l'application pour effacer l'ensemble des données stockées localement ;\n• Contacter notre DPO à dpo@djalico.com pour toute demande relative à vos données.",
      },
      {
        title: "7. Modifications",
        body:
          "Cette politique de cookies peut être mise à jour pour refléter les évolutions de nos pratiques ou de la réglementation. Toute modification substantielle vous sera notifiée dans l'application.",
      },
    ],
  },
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function LegalScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type: string }>();
  const content = LEGAL_CONTENT[type ?? "mentions"] ?? LEGAL_CONTENT.mentions;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={C.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {content.heading}
        </Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <Text style={styles.updated}>{content.updated}</Text>

        {content.sections.map((section, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Pour toute question, contactez-nous à{"\n"}
            <Text style={styles.footerEmail}>contact@djalico.com</Text>
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.bg,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    color: C.navy,
    marginHorizontal: 8,
  },

  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  updated: {
    fontSize: 12,
    color: C.softGray,
    marginBottom: 24,
    fontStyle: "italic",
  },

  section: {
    marginBottom: 24,
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: C.navy,
    marginBottom: 10,
  },
  sectionBody: {
    fontSize: 14,
    color: C.textMuted,
    lineHeight: 22,
  },

  footer: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.border,
  },
  footerText: {
    fontSize: 13,
    color: C.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
  footerEmail: {
    color: C.navy,
    fontWeight: "600",
  },
});
