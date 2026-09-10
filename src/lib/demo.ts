import { ComplaintAnalysis, GeneratedComplaint, DemoScenario } from '../types/complaint';

const demoScenarios: DemoScenario[] = [
  {
    id: 'streetlight',
    title: 'Broken Streetlight',
    titleUrdu: 'سٹریٹ لائٹ خراب',
    description: 'Streetlight has been broken for 3 weeks near University Town',
    transcript: 'Hamari gali mein teen hafton se street light kharab hai. University Town ke qareeb hai aur raat ko bohat andhera hota hai.',
    analysis: {
      language: 'ur',
      transcript: 'Hamari gali mein teen hafton se street light kharab hai. University Town ke qareeb hai aur raat ko bohat andhera hota hai.',
      category: 'streetlight',
      department: 'TMA',
      departmentConfidence: 0.89,
      departmentReason: 'Streetlight maintenance falls under municipal authority.',
      location: 'University Town',
      duration: '3 weeks',
      severity: 'medium',
      publicSafetyImpact: true,
      summary: 'Non-functional streetlight causing darkness at night near University Town for three weeks.',
      missingInformation: [],
    },
    generated: {
      subject: 'Request for Repair of Non-Functional Streetlight — University Town',
      formalBody: 'Subject: Request for Repair of Non-Functional Streetlight\n\nRespected Sir/Madam,\n\nI am writing to report a non-functional streetlight in the area of University Town. The streetlight has been out of order for approximately three weeks.\n\nDue to this, the street becomes extremely dark at night, creating a public safety concern for residents and pedestrians.\n\nI kindly request that the concerned department look into this matter and arrange for the repair or replacement of the streetlight at the earliest.\n\nThank you for your attention to this matter.',
      whatsappMessage: 'Assalam o Alaikum,\n\nI want to report that the streetlight near University Town has been broken for 3 weeks. It gets very dark at night and is a safety concern.\n\nKindly look into this.\n\nThank you.',
    },
  },
  {
    id: 'water',
    title: 'Water Supply Issue',
    titleUrdu: 'پانی کا مسئلہ',
    description: 'No water supply for 2 days',
    transcript: 'Hamare ilaqe mein do din se pani nahi aa raha.',
    analysis: {
      language: 'ur',
      transcript: 'Hamare ilaqe mein do din se pani nahi aa raha.',
      category: 'water',
      department: 'WASA',
      departmentConfidence: 0.92,
      departmentReason: 'Water supply issues are handled by WASA.',
      location: '',
      duration: '2 days',
      severity: 'high',
      publicSafetyImpact: false,
      summary: 'No water supply in the area for two days.',
      missingInformation: ['location'],
    },
    generated: {
      subject: 'Complaint Regarding Water Supply Disruption',
      formalBody: 'Subject: Complaint Regarding Water Supply Disruption\n\nRespected Sir/Madam,\n\nI am writing to report that there has been no water supply in our area for the past two days.\n\nThis is causing significant difficulty for residents who depend on regular water supply for daily needs.\n\nI request that the concerned department investigate the cause of this disruption and restore supply as soon as possible.\n\nThank you.',
      whatsappMessage: 'Assalam o Alaikum,\n\nOur area has had no water supply for 2 days now. Kindly look into this urgently.\n\nThank you.',
    },
  },
  {
    id: 'electricity',
    title: 'Electricity Fluctuation',
    titleUrdu: 'بجلی کا مسئلہ',
    description: 'Voltage fluctuation since yesterday',
    transcript: 'Kal se hamare ilaqe mein bijli ka masla hai aur voltage bohat up down ho raha hai.',
    analysis: {
      language: 'ur',
      transcript: 'Kal se hamare ilaqe mein bijli ka masla hai aur voltage bohat up down ho raha hai.',
      category: 'electricity',
      department: 'PESCO',
      departmentConfidence: 0.94,
      departmentReason: 'Electricity supply and voltage issues are handled by PESCO.',
      location: '',
      duration: 'Since yesterday',
      severity: 'medium',
      publicSafetyImpact: false,
      summary: 'Electricity voltage fluctuation in the area since yesterday.',
      missingInformation: ['location'],
    },
    generated: {
      subject: 'Complaint Regarding Voltage Fluctuation',
      formalBody: 'Subject: Complaint Regarding Voltage Fluctuation\n\nRespected Sir/Madam,\n\nI am writing to report that since yesterday, our area has been experiencing electricity issues with significant voltage fluctuation.\n\nThe voltage keeps going up and down, which may damage electrical appliances and poses a risk to household safety.\n\nI request that the concerned department investigate and resolve this issue at the earliest.\n\nThank you.',
      whatsappMessage: 'Assalam o Alaikum,\n\nSince yesterday, our area is having electricity problems with voltage fluctuating a lot. Kindly resolve this.\n\nThank you.',
    },
  },
];

export function getDemoScenarios(): DemoScenario[] {
  return demoScenarios;
}

export function getDemoScenario(id: string): DemoScenario | undefined {
  return demoScenarios.find(s => s.id === id);
}

export function getDemoAnalysis(): ComplaintAnalysis {
  return demoScenarios[0].analysis;
}

export function getDemoGenerated(): GeneratedComplaint {
  return demoScenarios[0].generated;
}
