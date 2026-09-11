type Section = { title: string; body: string };
type LegalDoc = { heading: string; updated: string; sections: Section[] };
type LegalLocale = Record<string, LegalDoc>;

export const LEGAL_CONTENT: Record<"fr" | "en", LegalLocale> = {
  fr: {
    mentions: {
      heading: "Mentions légales",
      updated: "Source : www.djalicosamb.fr/mentions-legales",
      sections: [
        {
          title: "1. Présentation du site",
          body: "En vertu de l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, il est précisé aux utilisateurs de l'application Djalico l'identité des différents intervenants dans le cadre de sa réalisation et de son suivi :\n\nPropriétaire : DJALICO – association loi 1901 – MJC, parc Babouin, 07800 La Voulte-sur-Rhône\nSIRET : 790 775 571 00017\nTéléphone : 06 48 15 60 08\nResponsable publication : direction@djalicosamb.fr\nWebmaster : Samuel PABION – webmaster@djalicosamb.fr\nHébergeur : 1&1 Ionos SARL – 7 place de la Gare, BP 70109, 57201 Sarreguemines Cedex",
        },
        {
          title: "2. Conditions générales d'utilisation du site et des services proposés",
          body: "L'utilisation du site www.djalicosamb.fr implique l'acceptation pleine et entière des conditions générales d'utilisation ci-après décrites. Ces conditions d'utilisation sont susceptibles d'être modifiées ou complétées à tout moment, les utilisateurs du site www.djalicosamb.fr sont donc invités à les consulter de manière régulière.\n\nCe site est normalement accessible à tout moment aux utilisateurs. Une interruption pour raison de maintenance technique peut être toutefois décidée par DJALICO, qui s'efforcera alors de communiquer préalablement aux utilisateurs les dates et heures de l'intervention.\n\nLe site www.djalicosamb.fr est mis à jour régulièrement. De la même façon, les mentions légales peuvent être modifiées à tout moment : elles s'imposent néanmoins à l'utilisateur qui est invité à s'y référer le plus souvent possible afin d'en prendre connaissance.",
        },
        {
          title: "3. Description des services fournis",
          body: "Le site www.djalicosamb.fr a pour objet de fournir une information concernant l'ensemble des activités de l'association.\n\nDJALICO s'efforce de fournir sur le site www.djalicosamb.fr des informations aussi précises que possible. Toutefois, il ne pourra être tenu responsable des omissions, des inexactitudes et des carences dans la mise à jour, qu'elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.\n\nToutes les informations indiquées sur le site www.djalicosamb.fr sont données à titre indicatif, et sont susceptibles d'évoluer. Par ailleurs, les renseignements figurant sur le site www.djalicosamb.fr ne sont pas exhaustifs. Ils sont donnés sous réserve de modifications ayant été apportées depuis leur mise en ligne.",
        },
        {
          title: "4. Limitations contractuelles sur les données techniques",
          body: "Le site utilise la technologie JavaScript.\n\nLe site Internet ne pourra être tenu responsable de dommages matériels liés à l'utilisation du site. De plus, l'utilisateur du site s'engage à accéder au site en utilisant un matériel récent, ne contenant pas de virus et avec un navigateur de dernière génération mis à jour.",
        },
        {
          title: "5. Propriété intellectuelle et contrefaçons",
          body: "DJALICO est propriétaire des droits de propriété intellectuelle ou détient les droits d'usage sur tous les éléments accessibles sur le site, notamment les textes, images, graphismes, logo, icônes, sons, logiciels.\n\nToute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de DJALICO.\n\nToute exploitation non autorisée du site ou de l'un quelconque des éléments qu'il contient sera considérée comme constitutive d'une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du Code de Propriété Intellectuelle.",
        },
        {
          title: "6. Limitations de responsabilité",
          body: "DJALICO ne pourra être tenue responsable des dommages directs et indirects causés au matériel de l'utilisateur, lors de l'accès au site www.djalicosamb.fr, et résultant soit de l'utilisation d'un matériel ne répondant pas aux spécifications indiquées au point 4, soit de l'apparition d'un bug ou d'une incompatibilité.\n\nDJALICO ne pourra également être tenue responsable des dommages indirects (tels par exemple qu'une perte de marché ou perte d'une chance) consécutifs à l'utilisation du site www.djalicosamb.fr.\n\nDes espaces interactifs (possibilité de poser des questions dans l'espace contact) sont à la disposition des utilisateurs. DJALICO se réserve le droit de supprimer, sans mise en demeure préalable, tout contenu déposé dans cet espace qui contreviendrait à la législation applicable en France, en particulier aux dispositions relatives à la protection des données. Le cas échéant, DJALICO se réserve également la possibilité de mettre en cause la responsabilité civile et/ou pénale de l'utilisateur, notamment en cas de message à caractère raciste, injurieux, diffamant, ou pornographique, quel que soit le support utilisé (texte, photographie…).",
        },
        {
          title: "7. Gestion des données personnelles",
          body: "En France, les données personnelles sont notamment protégées par la loi n° 78-87 du 6 janvier 1978, la loi n° 2004-801 du 6 août 2004, l'article L. 226-13 du Code pénal et la Directive Européenne du 24 octobre 1995.\n\nÀ l'occasion de l'utilisation du site www.djalicosamb.fr, peuvent être recueillies : l'URL des liens par l'intermédiaire desquels l'utilisateur a accédé au site www.djalicosamb.fr, le fournisseur d'accès de l'utilisateur, l'adresse de protocole Internet (IP) de l'utilisateur.\n\nEn tout état de cause DJALICO ne collecte des informations personnelles relatives à l'utilisateur que pour le besoin de certains services proposés par le site www.djalicosamb.fr. L'utilisateur fournit ces informations en toute connaissance de cause, notamment lorsqu'il procède par lui-même à leur saisie. Il est alors précisé à l'utilisateur du site www.djalicosamb.fr l'obligation ou non de fournir ces informations.\n\nConformément aux dispositions des articles 38 et suivants de la loi 78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés, tout utilisateur dispose d'un droit d'accès, de rectification et d'opposition aux données personnelles le concernant, en effectuant sa demande écrite et signée, accompagnée d'une copie du titre d'identité avec signature du titulaire de la pièce, en précisant l'adresse à laquelle la réponse doit être envoyée.\n\nAucune information personnelle de l'utilisateur du site www.djalicosamb.fr n'est publiée à l'insu de l'utilisateur, échangée, transférée, cédée ou vendue sur un support quelconque à des tiers.\n\nLe site n'est pas déclaré à la CNIL car il ne recueille pas d'informations personnelles.\n\nLes bases de données sont protégées par les dispositions de la loi du 1er juillet 1998 transposant la directive 96/9 du 11 mars 1996 relative à la protection juridique des bases de données.",
        },
        {
          title: "8. Liens hypertextes et cookies",
          body: "Le site www.djalicosamb.fr contient un certain nombre de liens hypertextes vers d'autres sites, mis en place avec l'autorisation de DJALICO. Cependant, DJALICO n'a pas la possibilité de vérifier le contenu des sites ainsi visités, et n'assumera en conséquence aucune responsabilité de ce fait.\n\nLa navigation sur le site www.djalicosamb.fr est susceptible de provoquer l'installation de cookie(s) sur l'ordinateur de l'utilisateur. Un cookie est un fichier de petite taille, qui ne permet pas l'identification de l'utilisateur, mais qui enregistre des informations relatives à la navigation d'un ordinateur sur un site. Les données ainsi obtenues visent à faciliter la navigation ultérieure sur le site, et ont également vocation à permettre diverses mesures de fréquentation.\n\nLe refus d'installation d'un cookie peut entraîner l'impossibilité d'accéder à certains services. L'utilisateur peut toutefois configurer son ordinateur pour refuser l'installation des cookies, en modifiant les réglages de confidentialité de son navigateur (Internet Explorer, Firefox, Safari, Chrome).",
        },
        {
          title: "9. Droit applicable et attribution de juridiction",
          body: "Tout litige en relation avec l'utilisation du site www.djalicosamb.fr est soumis au droit français. Il est fait attribution exclusive de juridiction aux tribunaux compétents de Paris.",
        },
        {
          title: "10. Les principales lois concernées",
          body: "Loi n° 78-17 du 6 janvier 1978, notamment modifiée par la loi n° 2004-801 du 6 août 2004 relative à l'informatique, aux fichiers et aux libertés.\n\nLoi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique.",
        },
        {
          title: "11. Lexique",
          body: "Utilisateur : Internaute se connectant, utilisant le site susnommé.\n\nInformations personnelles : « les informations qui permettent, sous quelque forme que ce soit, directement ou non, l'identification des personnes physiques auxquelles elles s'appliquent » (article 4 de la loi n° 78-17 du 6 janvier 1978).",
        },
      ],
    },

    cgu: {
      heading: "Conditions Générales d'Utilisation",
      updated: "Dernière mise à jour : 1er janvier 2025",
      sections: [
        {
          title: "1. Objet",
          body: "Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités et conditions dans lesquelles DJALICO, association loi 1901, met à disposition de ses utilisateurs l'application mobile Djalico, plateforme d'éducation musicale en ligne.",
        },
        {
          title: "2. Accès au service",
          body: "L'accès à l'application Djalico est réservé aux personnes physiques majeures ou aux mineurs disposant de l'autorisation parentale. La création d'un compte est obligatoire pour accéder aux fonctionnalités de l'application. L'utilisateur s'engage à fournir des informations exactes, complètes et à jour lors de son inscription.",
        },
        {
          title: "3. Compte utilisateur",
          body: "Chaque utilisateur est responsable de la confidentialité de ses identifiants de connexion. En cas de perte ou de compromission de son mot de passe, l'utilisateur doit en informer immédiatement DJALICO à l'adresse direction@djalicosamb.fr. DJALICO ne saurait être tenu responsable de toute utilisation frauduleuse du compte résultant d'un manquement de l'utilisateur à ses obligations de confidentialité.",
        },
        {
          title: "4. Utilisation du service",
          body: "L'utilisateur s'engage à utiliser l'application conformément aux lois en vigueur et aux présentes CGU. Il est notamment interdit de :\n• Reproduire, copier, vendre ou revendre tout ou partie du contenu de l'application sans autorisation préalable ;\n• Utiliser l'application à des fins illicites, frauduleuses ou malveillantes ;\n• Tenter de pirater, d'accéder sans autorisation aux systèmes informatiques de DJALICO ;\n• Perturber le bon fonctionnement de l'application.",
        },
        {
          title: "5. Contenu pédagogique",
          body: "Les cours, vidéos, parcours et ressources pédagogiques disponibles sur Djalico sont protégés par le droit d'auteur et sont destinés à un usage personnel et non commercial. L'utilisateur s'interdit de les partager, redistribuer ou exploiter commercialement sans accord écrit préalable de DJALICO.",
        },
        {
          title: "6. Abonnements et paiements",
          body: "Certaines fonctionnalités de l'application sont accessibles via un abonnement payant. Les tarifs, modalités de paiement et conditions de résiliation sont précisés lors du processus d'abonnement. Les abonnements sont renouvelables automatiquement sauf résiliation par l'utilisateur avant la date de renouvellement.",
        },
        {
          title: "7. Suspension et résiliation",
          body: "DJALICO se réserve le droit de suspendre ou de supprimer le compte d'un utilisateur en cas de violation des présentes CGU, sans préavis ni indemnité. L'utilisateur peut supprimer son compte à tout moment en contactant le support à l'adresse direction@djalicosamb.fr.",
        },
        {
          title: "8. Modification des CGU",
          body: "DJALICO se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification substantielle par notification dans l'application. L'utilisation continue de l'application après modification vaut acceptation des nouvelles CGU.",
        },
        {
          title: "9. Droit applicable et juridiction",
          body: "Les présentes CGU sont soumises au droit français. Tout litige relatif à leur interprétation ou leur exécution relève de la compétence exclusive des tribunaux du ressort de la Cour d'appel de Paris.",
        },
      ],
    },

    privacy: {
      heading: "Politique de confidentialité",
      updated: "Dernière mise à jour : 1er janvier 2025",
      sections: [
        {
          title: "Qui sommes-nous ?",
          body: "L'application mobile Djalico est éditée par DJALICO, association loi 1901, dont le siège est situé MJC, parc Babouin, 07800 La Voulte-sur-Rhône (SIRET : 790 775 571 00017). Pour toute question relative à vos données personnelles, vous pouvez nous contacter à direction@djalicosamb.fr.",
        },
        {
          title: "Données collectées à l'inscription",
          body: "Lors de la création de votre compte, nous collectons votre nom, votre adresse e-mail et votre mot de passe (stocké de façon chiffrée par notre prestataire d'authentification, voir « Hébergement et sous-traitants » ci-dessous).\n\nLors de l'étape d'inscription complémentaire (onboarding), nous collectons également votre date de naissance, votre numéro de téléphone, votre objectif d'apprentissage, le niveau demandé et les instruments qui vous intéressent. Ces informations permettent à nos équipes de valider votre compte et de vous proposer un parcours adapté.",
        },
        {
          title: "Photo de profil",
          body: "Si vous choisissez d'ajouter une photo de profil, celle-ci est téléversée et stockée sur l'espace de stockage sécurisé de notre prestataire d'hébergement. Vous pouvez la remplacer ou la retirer à tout moment depuis les réglages de votre compte.",
        },
        {
          title: "Données d'utilisation",
          body: "Pour vous permettre de reprendre une vidéo là où vous l'aviez laissée, nous enregistrons votre progression de visionnage (pourcentage regardé, position de lecture) pour chaque vidéo. Nous enregistrons également la liste des vidéos que vous choisissez de sauvegarder dans l'application.",
        },
        {
          title: "Données techniques et de session",
          body: "Un jeton de session est stocké de façon sécurisée sur votre appareil afin de vous maintenir connecté·e entre deux ouvertures de l'application. Votre préférence de langue est également mémorisée localement sur votre appareil.",
        },
        {
          title: "Hébergement et sous-traitants",
          body: "Les données décrites ci-dessus sont hébergées et traitées par Supabase (base de données, authentification, stockage de fichiers), notre prestataire technique. Supabase agit en tant que sous-traitant au sens du RGPD et applique ses propres mesures de sécurité, détaillées sur supabase.com/privacy.",
        },
        {
          title: "Contenu embarqué",
          body: "Certaines leçons intègrent des vidéos YouTube directement dans l'application. Lorsqu'une vidéo YouTube est lue, Google/YouTube peut collecter des données sur votre visionnage selon sa propre politique de confidentialité, indépendamment de Djalico.",
        },
        {
          title: "Durées de conservation",
          body: "Vos données de profil (nom, e-mail, date de naissance, téléphone, objectif, niveau, instruments, photo) sont conservées tant que votre compte est actif. Votre jeton de session est supprimé à la déconnexion ou après une période d'inactivité prolongée. Si vous demandez la suppression de votre compte, l'ensemble de ces données est supprimé, sous réserve des obligations légales de conservation qui pourraient s'appliquer.",
        },
        {
          title: "Les droits que vous avez sur vos données",
          body: "Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, d'opposition et de suppression concernant vos données personnelles. Pour exercer ces droits, contactez-nous à direction@djalicosamb.fr. Vous pouvez également modifier directement votre nom, votre e-mail et votre photo de profil depuis les réglages de l'application.",
        },
        {
          title: "Transmission de vos données personnelles",
          body: "Nous ne vendons ni ne partageons vos données personnelles avec des tiers à des fins commerciales. Elles ne sont accessibles qu'à notre équipe et à notre sous-traitant technique (Supabase), dans la stricte mesure nécessaire au fonctionnement de l'application.",
        },
      ],
    },

    cookies: {
      heading: "Politique de cookies",
      updated: "Dernière mise à jour : 1er janvier 2025",
      sections: [
        {
          title: "1. Qu'est-ce qu'un cookie ?",
          body: "Un cookie est un petit fichier texte déposé sur votre appareil (smartphone, tablette) lors de la visite d'un site ou de l'utilisation d'une application. Il permet de mémoriser des informations relatives à votre navigation afin de vous offrir une expérience personnalisée.",
        },
        {
          title: "2. Cookies utilisés par Djalico",
          body: "L'application Djalico n'utilise pas de cookies au sens classique du terme. En tant qu'application mobile native, elle recourt à des mécanismes de stockage local équivalents :\n\n• Token de session (stockage sécurisé) : permet de maintenir votre connexion entre deux ouvertures de l'application. Ce token est chiffré et stocké dans le trousseau sécurisé de votre appareil.\n\n• Préférences utilisateur (AsyncStorage) : mémorise vos réglages locaux tels que la langue choisie, afin de ne pas les redemander à chaque démarrage.\n\n• Cache de requêtes (TanStack Query) : conserve temporairement en mémoire les données récupérées depuis notre API pour accélérer l'affichage et réduire la consommation de données.",
        },
        {
          title: "3. Traceurs analytiques",
          body: "Nous pouvons utiliser des outils d'analyse anonymisés pour mesurer l'audience et améliorer l'application (nombre de sessions, écrans consultés, taux de complétion des cours). Ces données sont agrégées et ne permettent pas de vous identifier personnellement.",
        },
        {
          title: "4. Cookies tiers",
          body: "Certains contenus intégrés dans l'application (notamment les vidéos YouTube) peuvent déposer des cookies ou traceurs tiers soumis à leur propre politique de confidentialité. Nous vous invitons à consulter la politique de confidentialité de Google/YouTube pour en savoir plus.",
        },
        {
          title: "5. Durée de conservation",
          body: "• Token de session : supprimé lors de la déconnexion ou après 30 jours d'inactivité.\n• Préférences locales : conservées jusqu'à la désinstallation de l'application ou réinitialisation manuelle.\n• Cache de requêtes : conservé en mémoire vive uniquement, effacé à la fermeture de l'application.",
        },
        {
          title: "6. Gestion et suppression",
          body: "Vous pouvez à tout moment :\n• Vous déconnecter de l'application pour supprimer votre token de session ;\n• Désinstaller l'application pour effacer l'ensemble des données stockées localement ;\n• Contacter direction@djalicosamb.fr pour toute demande relative à vos données.",
        },
        {
          title: "7. Modifications",
          body: "Cette politique de cookies peut être mise à jour pour refléter les évolutions de nos pratiques ou de la réglementation. Toute modification substantielle vous sera notifiée dans l'application.",
        },
      ],
    },
  },

  en: {
    mentions: {
      heading: "Legal Notice",
      updated: "Source: www.djalicosamb.fr/mentions-legales",
      sections: [
        {
          title: "1. Site presentation",
          body: "Pursuant to article 6 of French law n° 2004-575 of 21 June 2004 on confidence in the digital economy, users of the Djalico application are informed of the identity of the various parties involved in its creation and maintenance:\n\nOwner: DJALICO – non-profit association (loi 1901) – MJC, parc Babouin, 07800 La Voulte-sur-Rhône, France\nSIRET: 790 775 571 00017\nPhone: +33 6 48 15 60 08\nPublication manager: direction@djalicosamb.fr\nWebmaster: Samuel PABION – webmaster@djalicosamb.fr\nHost: 1&1 Ionos SARL – 7 place de la Gare, BP 70109, 57201 Sarreguemines Cedex, France",
        },
        {
          title: "2. General terms of use of the site and services offered",
          body: "Use of the www.djalicosamb.fr website implies full acceptance of the general terms of use described below. These terms may be modified or supplemented at any time, so users are invited to consult them regularly.\n\nThis site is normally accessible to users at all times. An interruption for technical maintenance may however be decided by DJALICO, which will endeavour to inform users beforehand of the dates and times of the intervention.\n\nThe www.djalicosamb.fr website is updated regularly. Likewise, this legal notice may be modified at any time: it nonetheless remains binding on the user, who is invited to refer to it as often as possible.",
        },
        {
          title: "3. Description of services provided",
          body: "The www.djalicosamb.fr website aims to provide information about the association's activities.\n\nDJALICO strives to provide information on the www.djalicosamb.fr website that is as accurate as possible. However, it cannot be held responsible for omissions, inaccuracies, or failures to update, whether caused by itself or by third-party partners who provide this information.\n\nAll information on the www.djalicosamb.fr website is provided for guidance only and is subject to change. Furthermore, the information on the website is not exhaustive and is provided subject to any changes made since it was put online.",
        },
        {
          title: "4. Contractual limitations on technical data",
          body: "The site uses JavaScript technology.\n\nThe website cannot be held liable for material damage related to its use. In addition, the user agrees to access the site using up-to-date equipment free of viruses and an up-to-date, recent-generation browser.",
        },
        {
          title: "5. Intellectual property and infringement",
          body: "DJALICO owns the intellectual property rights or holds the usage rights to all elements accessible on the site, including text, images, graphics, logo, icons, sounds, and software.\n\nAny reproduction, representation, modification, publication, or adaptation of all or part of the site's elements, by any means or process whatsoever, is prohibited without the prior written authorisation of DJALICO.\n\nAny unauthorised use of the site or of any of the elements it contains will be considered an infringement and prosecuted in accordance with articles L.335-2 et seq. of the French Intellectual Property Code.",
        },
        {
          title: "6. Limitation of liability",
          body: "DJALICO cannot be held liable for direct or indirect damage to the user's equipment when accessing the www.djalicosamb.fr website, resulting either from the use of equipment that does not meet the specifications indicated in point 4, or from the appearance of a bug or incompatibility.\n\nDJALICO also cannot be held liable for indirect damages (such as loss of business or loss of opportunity) resulting from use of the site.\n\nInteractive spaces (the ability to ask questions in the contact area) are available to users. DJALICO reserves the right to remove, without prior notice, any content posted in this space that violates applicable French law, particularly provisions relating to data protection. Where applicable, DJALICO also reserves the right to pursue the civil and/or criminal liability of the user, particularly in the case of racist, insulting, defamatory, or pornographic messages, regardless of the medium used (text, photograph, etc.).",
        },
        {
          title: "7. Personal data management",
          body: "In France, personal data is protected in particular by law n° 78-87 of 6 January 1978, law n° 2004-801 of 6 August 2004, article L. 226-13 of the Criminal Code, and the European Directive of 24 October 1995.\n\nWhen using the www.djalicosamb.fr website, the following may be collected: the URL of the links through which the user accessed the site, the user's internet service provider, and the user's IP address.\n\nIn any event, DJALICO only collects personal information about the user for the purposes of certain services offered by the site. The user provides this information knowingly, particularly when entering it themselves. Users are informed whether providing this information is mandatory.\n\nIn accordance with articles 38 et seq. of law 78-17 of 6 January 1978 on data processing, files, and civil liberties, every user has the right to access, rectify, and object to personal data concerning them, by making a signed written request, accompanied by a copy of an identity document bearing the signature of the document holder, specifying the address to which the response should be sent.\n\nNo personal information about the user of the www.djalicosamb.fr website is published without the user's knowledge, exchanged, transferred, assigned, or sold on any medium to third parties.\n\nThe site is not registered with the CNIL (French data protection authority) as it does not collect personal information.\n\nDatabases are protected by the provisions of the law of 1 July 1998 transposing directive 96/9 of 11 March 1996 on the legal protection of databases.",
        },
        {
          title: "8. Hyperlinks and cookies",
          body: "The www.djalicosamb.fr website contains a number of hyperlinks to other sites, set up with DJALICO's authorisation. However, DJALICO has no way of checking the content of the sites thus visited and will therefore assume no responsibility for this.\n\nBrowsing the www.djalicosamb.fr website may result in the installation of cookie(s) on the user's computer. A cookie is a small file that does not identify the user but records information about a computer's browsing on a site. The data thus obtained is intended to facilitate subsequent browsing on the site and to enable various audience measurements.\n\nRefusing to install a cookie may prevent access to certain services. However, users can configure their computer to refuse cookie installation by changing the privacy settings of their browser (Internet Explorer, Firefox, Safari, Chrome).",
        },
        {
          title: "9. Applicable law and jurisdiction",
          body: "Any dispute related to the use of the www.djalicosamb.fr website is subject to French law. Exclusive jurisdiction is granted to the competent courts of Paris.",
        },
        {
          title: "10. Main laws concerned",
          body: "Law n° 78-17 of 6 January 1978, as amended in particular by law n° 2004-801 of 6 August 2004 on data processing, files, and civil liberties.\n\nLaw n° 2004-575 of 21 June 2004 on confidence in the digital economy.",
        },
        {
          title: "11. Glossary",
          body: "User: any internet user connecting to and using the above-mentioned site.\n\nPersonal information: \"information which allows, in any form whatsoever, directly or indirectly, the identification of the natural persons to whom it applies\" (article 4 of law n° 78-17 of 6 January 1978).",
        },
      ],
    },

    cgu: {
      heading: "Terms of Use",
      updated: "Last updated: 1 January 2025",
      sections: [
        {
          title: "1. Purpose",
          body: "These Terms of Use set out the terms and conditions under which DJALICO, a non-profit association (loi 1901), makes the Djalico mobile application, an online music education platform, available to its users.",
        },
        {
          title: "2. Access to the service",
          body: "Access to the Djalico application is reserved for adults or minors with parental authorisation. Creating an account is required to access the application's features. Users agree to provide accurate, complete, and up-to-date information when registering.",
        },
        {
          title: "3. User account",
          body: "Each user is responsible for keeping their login credentials confidential. If a password is lost or compromised, the user must immediately inform DJALICO at direction@djalicosamb.fr. DJALICO cannot be held liable for any fraudulent use of an account resulting from a user's failure to meet their confidentiality obligations.",
        },
        {
          title: "4. Use of the service",
          body: "Users agree to use the application in accordance with applicable laws and these Terms. In particular, it is prohibited to:\n• Reproduce, copy, sell, or resell all or part of the application's content without prior authorisation;\n• Use the application for unlawful, fraudulent, or malicious purposes;\n• Attempt to hack or gain unauthorised access to DJALICO's computer systems;\n• Disrupt the proper functioning of the application.",
        },
        {
          title: "5. Educational content",
          body: "The courses, videos, learning paths, and educational resources available on Djalico are protected by copyright and are intended for personal, non-commercial use. Users may not share, redistribute, or commercially exploit them without DJALICO's prior written consent.",
        },
        {
          title: "6. Subscriptions and payments",
          body: "Some features of the application are accessible via a paid subscription. Pricing, payment terms, and cancellation conditions are specified during the subscription process. Subscriptions automatically renew unless cancelled by the user before the renewal date.",
        },
        {
          title: "7. Suspension and termination",
          body: "DJALICO reserves the right to suspend or delete a user's account in the event of a breach of these Terms, without notice or compensation. Users may delete their account at any time by contacting support at direction@djalicosamb.fr.",
        },
        {
          title: "8. Changes to the Terms",
          body: "DJALICO reserves the right to modify these Terms at any time. Users will be notified of any substantial changes via an in-app notification. Continued use of the application after a change constitutes acceptance of the new Terms.",
        },
        {
          title: "9. Applicable law and jurisdiction",
          body: "These Terms are governed by French law. Any dispute relating to their interpretation or performance falls under the exclusive jurisdiction of the courts within the jurisdiction of the Paris Court of Appeal.",
        },
      ],
    },

    privacy: {
      heading: "Privacy Policy",
      updated: "Last updated: 1 January 2025",
      sections: [
        {
          title: "Who we are",
          body: "The Djalico mobile application is published by DJALICO, a non-profit association (loi 1901), headquartered at MJC, parc Babouin, 07800 La Voulte-sur-Rhône, France (SIRET: 790 775 571 00017). For any question about your personal data, you can contact us at direction@djalicosamb.fr.",
        },
        {
          title: "Data collected at sign-up",
          body: "When you create your account, we collect your name, email address, and password (stored encrypted by our authentication provider, see \"Hosting and subcontractors\" below).\n\nDuring the additional onboarding step, we also collect your date of birth, phone number, learning goal, requested level, and the instruments you're interested in. This information allows our team to validate your account and offer you a suitable learning path.",
        },
        {
          title: "Profile photo",
          body: "If you choose to add a profile photo, it is uploaded and stored on our hosting provider's secure storage. You can replace or remove it at any time from your account settings.",
        },
        {
          title: "Usage data",
          body: "To let you resume a video where you left off, we record your viewing progress (percentage watched, playback position) for each video. We also record the list of videos you choose to save within the application.",
        },
        {
          title: "Technical and session data",
          body: "A session token is stored securely on your device to keep you signed in between app openings. Your language preference is also stored locally on your device.",
        },
        {
          title: "Hosting and subcontractors",
          body: "The data described above is hosted and processed by Supabase (database, authentication, file storage), our technical provider. Supabase acts as a data processor under the GDPR and applies its own security measures, detailed at supabase.com/privacy.",
        },
        {
          title: "Embedded content",
          body: "Some lessons embed YouTube videos directly within the application. When a YouTube video is played, Google/YouTube may collect data about your viewing according to its own privacy policy, independently of Djalico.",
        },
        {
          title: "Retention periods",
          body: "Your profile data (name, email, date of birth, phone number, goal, level, instruments, photo) is kept for as long as your account is active. Your session token is deleted upon logout or after a prolonged period of inactivity. If you request deletion of your account, all of this data is deleted, subject to any legal retention obligations that may apply.",
        },
        {
          title: "Your rights over your data",
          body: "In accordance with the General Data Protection Regulation (GDPR), you have the right to access, rectify, object to, and delete your personal data. To exercise these rights, contact us at direction@djalicosamb.fr. You can also directly edit your name, email, and profile photo from the application's settings.",
        },
        {
          title: "Transmission of your personal data",
          body: "We do not sell or share your personal data with third parties for commercial purposes. It is only accessible to our team and to our technical subcontractor (Supabase), to the extent strictly necessary for the application to function.",
        },
      ],
    },

    cookies: {
      heading: "Cookie Policy",
      updated: "Last updated: 1 January 2025",
      sections: [
        {
          title: "1. What is a cookie?",
          body: "A cookie is a small text file placed on your device (smartphone, tablet) when you visit a site or use an application. It stores information about your browsing to offer you a personalised experience.",
        },
        {
          title: "2. Cookies used by Djalico",
          body: "The Djalico application does not use cookies in the traditional sense. As a native mobile application, it uses equivalent local storage mechanisms instead:\n\n• Session token (secure storage): keeps you signed in between app openings. This token is encrypted and stored in your device's secure keychain.\n\n• User preferences (AsyncStorage): remembers your local settings, such as your chosen language, so you don't have to set them again each time you open the app.\n\n• Request cache (TanStack Query): temporarily keeps data fetched from our API in memory to speed up display and reduce data usage.",
        },
        {
          title: "3. Analytics trackers",
          body: "We may use anonymised analytics tools to measure usage and improve the application (number of sessions, screens viewed, course completion rate). This data is aggregated and does not personally identify you.",
        },
        {
          title: "4. Third-party cookies",
          body: "Some content embedded in the application (notably YouTube videos) may set third-party cookies or trackers subject to their own privacy policy. We invite you to review Google/YouTube's privacy policy for more information.",
        },
        {
          title: "5. Retention period",
          body: "• Session token: deleted upon logout or after 30 days of inactivity.\n• Local preferences: kept until the application is uninstalled or manually reset.\n• Request cache: kept in memory only, cleared when the application is closed.",
        },
        {
          title: "6. Management and deletion",
          body: "At any time, you can:\n• Log out of the application to delete your session token;\n• Uninstall the application to erase all locally stored data;\n• Contact direction@djalicosamb.fr for any request regarding your data.",
        },
        {
          title: "7. Changes",
          body: "This cookie policy may be updated to reflect changes in our practices or in the law. You will be notified in the application of any substantial change.",
        },
      ],
    },
  },
};
