import { QuestionSchema } from "@/types/questionnaire";

export interface LocalizedQuestion {
  question: string;
  description?: string;
  placeholder?: string;
  options?: Record<string, string>; // value -> localized label
}

export const QUESTION_TRANSLATIONS: Record<string, Record<string, LocalizedQuestion>> = {
  hi: {
    selected_language: {
      question: "क्लिनिकल इनटेक के लिए अपनी भाषा चुनें",
      description: "वह भाषा चुनें जिसमें आप सवालों के जवाब देना चाहते हैं।",
    },
    digital_consent_agreement: {
      question: "डिजिटल सहमति प्राधिकरण (Informed Consent)",
      description: "डीपीडीपी अधिनियम और आभा (ABDM) दिशानिर्देशों के तहत क्लिनिकल इतिहास संग्रह और डॉक्टर शेयरिंग को अधिकृत करें।",
    },
    ayush_system_selection: {
      question: "परामर्श के लिए चिकित्सा / आयुष प्रणाली चुनें",
      description: "अपने परामर्श चिकित्सक की स्वास्थ्य प्रणाली चुनें।",
      options: {
        ALLOPATHY: "एलोपैथी (आधुनिक चिकित्सा)",
        AYURVEDA: "आयुर्वेद (BAMS / MD)",
        HOMEOPATHY: "होम्योपैथी (BHMS / MD)",
        UNANI: "यूनानी चिकित्सा (BUMS)",
        SIDDHA: "सिद्ध चिकित्सा (BSMS)",
        YOGA_NATUROPATHY: "योग एवं प्राकृतिक चिकित्सा (BNYS)",
      },
    },
    chief_complaint_symptom: {
      question: "आज आपकी मुख्य समस्या या लक्षण क्या है?",
      description: "उस मुख्य लक्षण का वर्णन करें जिसके कारण आप डॉक्टर के पास आए हैं।",
      placeholder: "जैसे: पेट के ऊपरी हिस्से में दर्द, लगातार सूखी खांसी, तेज बुखार...",
    },
    symptom_onset: {
      question: "यह लक्षण पहली बार कब शुरू हुआ?",
      description: "बताएं कि लक्षण अचानक शुरू हुआ या धीरे-धीरे।",
      options: {
        SUDDEN: "अचानक (तीव्र - कुछ घंटों से 1 दिन पहले)",
        GRADUAL_RECENT: "धीरे-धीरे (हाल ही में - 2 से 7 दिन पहले)",
        CHRONIC: "लंबे समय से (सप्ताहों या महीनों से)",
      },
    },
    symptom_duration: {
      question: "आपको यह समस्या कितने समय से है?",
      placeholder: "जैसे: 3 दिन, 2 सप्ताह, 1 महीना",
    },
    symptom_severity: {
      question: "अपने दर्द / परेशानी की गंभीरता को 1 से 10 के पैमाने पर बताएं",
      description: "1 = बहुत हल्का, 5 = मध्यम, 10 = असहनीय तेज दर्द।",
    },
    symptom_location: {
      question: "शरीर में दर्द या बेचैनी कहाँ महसूस हो रही है?",
    },
    pain_character: {
      question: "दर्द किस प्रकार का महसूस होता है?",
      options: {
        THROBBING: "धड़कता हुआ / टीस वाला दर्द",
        SHARP: "तेज / चुभने वाला दर्द",
        DULL_ACHE: "हल्का धीमा दर्द / भारी दबाव",
        BURNING: "जलन / एसिडिटी जैसी अनुभूति",
        CRAMPING: "मरोड़ / ऐंठन वाला दर्द",
        NUMBNESS: "सुन्नपन / झनझनाहट",
      },
    },
    pain_radiation: {
      question: "क्या दर्द शरीर के किसी अन्य हिस्से में फैलता है?",
      options: {
        NONE: "कहीं नहीं फैलता (एक ही जगह रहता है)",
        BACK: "पीठ की तरफ फैलता है",
        SHOULDER: "कंधे / गर्दन की ओर जाता है",
        ARM: "हाथ / छाती की तरफ जाता है",
        GROIN: "पेट के निचले हिस्से / जांघ की ओर जाता है",
      },
    },
    aggravating_factors: {
      question: "किस गतिविधि या कारण से परेशानी बढ़ जाती है?",
      options: {
        MEALS: "खाना खाने के बाद",
        FASTING: "खाली पेट रहने / उपवास से",
        MOVEMENT: "चलने-फिरने / शारीरिक मेहनत से",
        LYING_DOWN: "लेटने या सोने पर",
        STRESS: "तनाव या चिंता से",
      },
    },
    relieving_factors: {
      question: "किस चीज़ से परेशानी में राहत या आराम मिलता है?",
      options: {
        REST: "आराम करने / सोने से",
        WARM_FLUIDS: "गुनगुना पानी / दूध पीने से",
        MEDICINES: "एंटासिड या पुरानी दवा लेने से",
        BOWEL: "पेट साफ होने या गैस निकलने से",
        HEAT_ICE: "सिकाई करने (गर्म या बर्फ) से",
      },
    },
    associated_symptoms: {
      question: "क्या मुख्य परेशानी के साथ अन्य लक्षण भी हैं?",
      options: {
        FEVER: "बुखार या ठंड लगना",
        NAUSEA_VOMITING: "मतली या उल्टी",
        BREATHLESSNESS: "सांस फूलना या सांस लेने में कठिनाई",
        DIZZINESS: "चक्कर आना या कमजोरी",
        LOSS_OF_APPETITE: "भूख में कमी",
        HEADACHE: "सिरदर्द",
      },
    },
  },
  bn: {
    selected_language: {
      question: "ক্লিনিকাল ইনটেকের জন্য আপনার ভাষা নির্বাচন করুন",
      description: "আপনি যে ভাষায় প্রশ্নের উত্তর দিতে চান তা নির্বাচন করুন।",
    },
    digital_consent_agreement: {
      question: "ডিজিটাল সম্মতি অনুমোদন (Informed Consent)",
      description: "DPDP আইন এবং আভা (ABDM) নির্দেশিকার অধীনে স্বাস্থ্য তথ্য সংগ্রহ এবং ডাক্তার অনুমোদনের অনুমতি দিন।",
    },
    ayush_system_selection: {
      question: "পরামর্শের জন্য চিকিৎসা / আয়ুশ পদ্ধতি নির্বাচন করুন",
      description: "আপনার পরামর্শকারী চিকিৎসকের স্বাস্থ্যসেবা পদ্ধতি নির্বাচন করুন।",
      options: {
        ALLOPATHY: "অ্যালোপ্যাথি (আধুনিক চিকিৎসা)",
        AYURVEDA: "আয়ুর্বেদ (BAMS / MD)",
        HOMEOPATHY: "হোমিওপ্যাথি (BHMS / MD)",
        UNANI: "ইউনানি চিকিৎসা (BUMS)",
        SIDDHA: "সিদ্ধ চিকিৎসা (BSMS)",
        YOGA_NATUROPATHY: "যোগ ও প্রাকৃতিক চিকিৎসা (BNYS)",
      },
    },
    chief_complaint_symptom: {
      question: "আজ আপনার প্রধান শারীরিক সমস্যা বা লক্ষণ কী?",
      description: "যে প্রধান সমস্যার কারণে আপনি ডাক্তারের শরণাপন্ন হয়েছেন তা বর্ণনা করুন।",
      placeholder: "যেমন: পেটের উপরিভাগে ব্যথা, একটানা শুকনো কাশি, তীব্র জ্বর...",
    },
    symptom_onset: {
      question: "এই সমস্যাটি প্রথম কখন শুরু হয়েছিল?",
      description: "সমস্যাটি হঠাৎ শুরু হয়েছে নাকি ধীরে ধীরে তা উল্লেখ করুন।",
      options: {
        SUDDEN: "হঠাৎ (তীব্র - কয়েক ঘণ্টা থেকে ১ দিন আগে)",
        GRADUAL_RECENT: "ধীরে ধীরে (সাম্প্রতিক - ২ থেকে ৭ দিন আগে)",
        CHRONIC: "দীর্ঘস্থায়ী (কয়েক সপ্তাহ বা মাস ধরে)",
      },
    },
    symptom_duration: {
      question: "আপনার এই সমস্যাটি কত দিন ধরে রয়েছে?",
      placeholder: "যেমন: ৩ দিন, ২ সপ্তাহ, ১ মাস",
    },
    symptom_severity: {
      question: "আপনার ব্যথার তীব্রতা ১ থেকে ১০ স্কেলে নির্ধারণ করুন",
      description: "১ = খুব হালকা, ৫ = মাঝারি, ১০ = অসহ্য তীব্র ব্যথা।",
    },
    symptom_location: {
      question: "শরীরের কোন অংশে অস্বস্তি বা ব্যথা অনুভূত হচ্ছে?",
    },
    pain_character: {
      question: "ব্যথাটি কেমন ধরনের অনুভূত হয়?",
      options: {
        THROBBING: "টিপটিপ বা দপদপ করা ব্যথা",
        SHARP: "তীক্ষ্ণ / ছুরি দিয়ে কাটার মতো ব্যথা",
        DULL_ACHE: "চাপা বা ভারী অনুভূতিযুক্ত ব্যথা",
        BURNING: "জ্বালাপোড়া বা অম্লজনিত অনুভূতি",
        CRAMPING: "খিল ধরা বা মোচড়ানো ব্যথা",
        NUMBNESS: "অবশ ভাব বা ঝিনঝিন করা",
      },
    },
    pain_radiation: {
      question: "ব্যথা কি শরীরের অন্য কোনো অংশে ছড়িয়ে পড়ে?",
      options: {
        NONE: "কোথাও ছড়ায় না (এক স্থানেই থাকে)",
        BACK: "পিঠের দিকে ছড়িয়ে পড়ে",
        SHOULDER: "কাঁধ বা ঘাড়ের দিকে যায়",
        ARM: "হাত বা বুকের দিকে যায়",
        GROIN: "তলপেট বা কুঁচকির দিকে যায়",
      },
    },
    aggravating_factors: {
      question: "কী করলে বা কী কারণে সমস্যাটি বেড়ে যায়?",
      options: {
        MEALS: "ভারী খাবার খাওয়ার পর",
        FASTING: "খালি পেটে থাকলে / উপবাস করলে",
        MOVEMENT: "শারীরিক পরিশ্রম বা চলাফেরা করলে",
        LYING_DOWN: "শুয়ে থাকলে বা ঘুমানোর সময়",
        STRESS: "মানসিক চাপ বা দুশ্চিন্তায়",
      },
    },
    relieving_factors: {
      question: "কী করলে সমস্যায় কিছুটা উপশম বা আরাম মেলে?",
      options: {
        REST: "বিশ্রাম নিলে বা ঘুমালে",
        WARM_FLUIDS: "ঈষদুষ্ণ জল বা দুধ পান করলে",
        MEDICINES: "অ্যান্টাসিড বা পূর্বের ওষুধ সেবনে",
        BOWEL: "পেট পরিষ্কার হলে বা গ্যাস নির্গত হলে",
        HEAT_ICE: "গরম বা বরফ সেঁক দিলে",
      },
    },
    associated_symptoms: {
      question: "প্রধান সমস্যার সাথে কি অন্য কোনো উপসর্গ রয়েছে?",
      options: {
        FEVER: "জ্বর বা কাঁপুনি",
        NAUSEA_VOMITING: "বমি বমি ভাব বা বমি",
        BREATHLESSNESS: "শ্বাসকষ্ট বা হাঁপিয়ে যাওয়া",
        DIZZINESS: "মাথা ঘোরা বা দুর্বলতা",
        LOSS_OF_APPETITE: "ক্ষুধামন্দা বা অরুচি",
        HEADACHE: "মাথাব্যথা",
      },
    },
  },
};

export function getLocalizedQuestion(question: QuestionSchema, lang: string): QuestionSchema {
  if (lang === "en" || !QUESTION_TRANSLATIONS[lang]) {
    return question;
  }

  const localized = QUESTION_TRANSLATIONS[lang][question.id];
  if (!localized) return question;

  const translatedOptions = question.options?.map((opt) => {
    const locLabel = localized.options?.[opt.value];
    return locLabel ? { ...opt, label: locLabel } : opt;
  });

  return {
    ...question,
    question: localized.question || question.question,
    description: localized.description || question.description,
    placeholder: localized.placeholder || question.placeholder,
    options: translatedOptions || question.options,
  };
}
