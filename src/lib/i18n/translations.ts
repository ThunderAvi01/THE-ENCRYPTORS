export interface UiTranslations {
  // Voice Controls
  micTapToSpeak: string;
  micListening: string;
  micProcessing: string;
  micRetry: string;
  micConfirmSend: string;
  micEditTranscript: string;
  micTranscriptPlaceholder: string;
  micFallbackTextMode: string;
  listenQuestion: string;
  stopAudio: string;
  
  // Intake Modes & Header
  formWizardMode: string;
  aiDialogueMode: string;
  saveDraft: string;
  saving: string;
  savedSuccessfully: string;
  backToPortal: string;

  // General Actions
  nextStep: string;
  backStep: string;
  skipStep: string;
  reviewAnswers: string;
  submitCase: string;
  submitting: string;
  
  // Elder / Low Literacy Cues
  speakYourResponse: string;
  orTypeText: string;
  touchSelectAnswer: string;
  needVoiceHelp: string;
  
  // Privacy & Disclaimers
  voicePrivacyNotice: string;
  aiDisclaimer: string;
}

export const TRANSLATIONS: Record<string, UiTranslations> = {
  en: {
    micTapToSpeak: "Tap to Speak",
    micListening: "Listening... Speak clearly",
    micProcessing: "Converting voice to text...",
    micRetry: "Re-record Voice",
    micConfirmSend: "Confirm & Send",
    micEditTranscript: "Edit text if recognized wrong",
    micTranscriptPlaceholder: "Your spoken response will appear here...",
    micFallbackTextMode: "Voice recognition unavailable. Type your response below.",
    listenQuestion: "Listen Question",
    stopAudio: "Stop Audio",

    formWizardMode: "Form Wizard",
    aiDialogueMode: "Voice & AI Dialogue",
    saveDraft: "Save Draft",
    saving: "Saving...",
    savedSuccessfully: "Case draft saved successfully.",
    backToPortal: "Back to Portal",

    nextStep: "Next Step",
    backStep: "Back",
    skipStep: "Skip",
    reviewAnswers: "Review Answers",
    submitCase: "Submit Clinical Case",
    submitting: "Submitting...",

    speakYourResponse: "Press microphone & talk",
    orTypeText: "Or type your answer below",
    touchSelectAnswer: "Tap options below",
    needVoiceHelp: "Voice Guidance Active",

    voicePrivacyNotice: "Voice is processed live in memory. Audio files are not stored indefinitely.",
    aiDisclaimer: "AI-assisted history collection. Does not provide medical diagnosis.",
  },
  hi: {
    micTapToSpeak: "बोलने के लिए माइक दबाएं",
    micListening: "सुन रहे हैं... कृपया स्पष्ट बोलें",
    micProcessing: "आवाज को पाठ (Text) में बदला जा रहा है...",
    micRetry: "पुनः रिकॉर्ड करें",
    micConfirmSend: "पुष्टि करें और भेजें",
    micEditTranscript: "यदि गलत लिखा है तो सुधारें",
    micTranscriptPlaceholder: "आपकी बोली गई बात यहाँ दिखाई देगी...",
    micFallbackTextMode: "आवाज सुविधा उपलब्ध नहीं है। कृपया नीचे लिखकर उत्तर दें।",
    listenQuestion: "प्रश्न सुनें",
    stopAudio: "आवाज बंद करें",

    formWizardMode: "फॉर्म विजार्ड",
    aiDialogueMode: "आवाज एवं AI संवाद",
    saveDraft: "ड्राफ्ट सहेजें",
    saving: "सहेजा जा रहा है...",
    savedSuccessfully: "केस का विवरण सफलतापूर्वक सहेजा गया।",
    backToPortal: "पोर्टल पर वापस जाएं",

    nextStep: "अगला कदम",
    backStep: "पीछे",
    skipStep: "छोड़ें",
    reviewAnswers: "उत्तरों की समीक्षा करें",
    submitCase: "केस सबमिट करें",
    submitting: "सबमिट हो रहा है...",

    speakYourResponse: "माइक दबाएं और बोलें",
    orTypeText: "या नीचे अपना उत्तर टाइप करें",
    touchSelectAnswer: "नीचे विकल्पों में से चुनें",
    needVoiceHelp: "आवाज मार्गदर्शन चालू है",

    voicePrivacyNotice: "आपकी आवाज केवल प्रक्रिया के लिए उपयोग की जाती है, रिकॉर्डिंग स्टोर नहीं की जाती।",
    aiDisclaimer: "AI-सहायता प्राप्त जानकारी संग्रह। यह चिकित्सकीय निदान प्रदान नहीं करता है।",
  },
  bn: {
    micTapToSpeak: "কথা বলতে মাইক টিপুন",
    micListening: "শুনছি... স্পষ্টভাবে কথা বলুন",
    micProcessing: "ভয়েস টেক্সটে রূপান্তর করা হচ্ছে...",
    micRetry: "পুনরায় রেকর্ড করুন",
    micConfirmSend: "নিশ্চিত করুন ও পাঠান",
    micEditTranscript: "ভুল হলে লেখাটি সংশোধন করুন",
    micTranscriptPlaceholder: "আপনার বলা কথাটি এখানে দেখাবে...",
    micFallbackTextMode: "ভয়েস সার্ভিস উপলব্ধ নেই। অনুগ্রহ করে নিচে লিখে উত্তর দিন।",
    listenQuestion: "প্রশ্নটি শুনুন",
    stopAudio: "শব্দ বন্ধ করুন",

    formWizardMode: "ফর্ম উইজার্ড",
    aiDialogueMode: "ভয়েস এবং AI সংলাপ",
    saveDraft: "ড্রাফট সংরক্ষণ করুন",
    saving: "সংরক্ষণ করা হচ্ছে...",
    savedSuccessfully: "কেস সফলভাবে সংরক্ষণ করা হয়েছে।",
    backToPortal: "পোর্টাল এ ফিরে যান",

    nextStep: "পরবর্তী ধাপ",
    backStep: "পিছনে",
    skipStep: "এড়িয়ে যান",
    reviewAnswers: "উত্তর পর্যালোচনা করুন",
    submitCase: "কেস জমা দিন",
    submitting: "জমা হচ্ছে...",

    speakYourResponse: "মাইক প্রেস করুন এবং বলুন",
    orTypeText: "অথবা নিচে আপনার উত্তর লিখুন",
    touchSelectAnswer: "নিচের বিকল্পগুলি নির্বাচন করুন",
    needVoiceHelp: "ভয়েস নির্দেশনা সক্রিয়",

    voicePrivacyNotice: "ভয়েস শুধুমাত্র তাৎক্ষণিকভাবে প্রক্রিয়া করা হয়, স্থায়ীভাবে সংরক্ষণ করা হয় না।",
    aiDisclaimer: "AI-সহায়তাপ্রাপ্ত তথ্য সংগ্রহ। এটি কোনো ডাক্তারি নির্ণয় নয়।",
  },
};

export function getTranslations(languageCode: string): UiTranslations {
  return TRANSLATIONS[languageCode] || TRANSLATIONS.en;
}
