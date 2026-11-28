export type Department = {
  code: string;
  name: string;
};

export type College = {
  name: string;
  departments: Department[];
};

// 단과대별 학과 코드 (2026 학과 안내 책자 기준, 책자 순서)
// TODO: 백엔드가 학과 목록 API에 단과대를 내려 주면 교체
const COLLEGE_DEPARTMENT_CODES: { name: string; codes: string[] }[] = [
  {
    name: '정경대학',
    codes: [
      'PUBLIC_ADMINISTRATION',
      'INTERNATIONAL_RELATIONS',
      'ECONOMICS',
      'SOCIAL_WELFARE',
      'TAXATION',
    ],
  },
  { name: '경영대학', codes: ['BUSINESS_ADMINISTRATION'] },
  {
    name: '인문대학',
    codes: [
      'ENGLISH_LANGUAGE_AND_LITERATURE',
      'KOREAN_LANGUAGE_AND_LITERATURE',
      'KOREAN_HISTORY',
      'PHILOSOPHY',
      'CHINESE_LANGUAGE_AND_CULTURE',
    ],
  },
  {
    // 책자에는 인문계열과 자연계열로 나뉘어 있지만 하나로 묶어요
    name: '도시과학대학',
    codes: [
      'URBAN_ADMINISTRATION',
      'URBAN_SOCIOLOGY',
      'ARCHITECTURE',
      'URBAN_ENGINEERING',
      'TRANSPORTATION_ENGINEERING',
      'LANDSCAPE_ARCHITECTURE',
      'ENVIRONMENTAL_ENGINEERING',
      'GEOINFORMATICS_ENGINEERING',
    ],
  },
  {
    name: '공과대학',
    codes: [
      'ELECTRICAL_AND_COMPUTER_ENGINEERING',
      'CHEMICAL_ENGINEERING',
      'MECHANICAL_AND_INFORMATION_ENGINEERING',
      'MATERIALS_SCIENCE_AND_ENGINEERING',
      'CIVIL_ENGINEERING',
    ],
  },
  {
    name: '자연과학대학',
    codes: [
      'MATHEMATICS',
      'STATISTICS',
      'PHYSICS',
      'LIFE_SCIENCE',
      'ENVIRONMENTAL_HORTICULTURE',
      'CONVERGENCE_APPLIED_CHEMISTRY',
    ],
  },
  { name: '예술체육대학', codes: ['MUSIC', 'DESIGN', 'SCULPTURE', 'SPORTS_SCIENCE'] },
  // 융합전공학부는 책자에 없어서 임시로 자유융합대학에 넣었어요
  { name: '자유융합대학', codes: ['LIBERAL_STUDIES', 'CONVERGENCE_STUDIES'] },
  {
    name: '인공지능융합대학',
    codes: ['COMPUTER_SCIENCE', 'ARTIFICIAL_INTELLIGENCE', 'ADVANCED_CONVERGENCE'],
  },
];

const ETC_COLLEGE = '기타';

// 학과 목록을 단과대별로 묶어요. 어느 단과대에도 없는 학과는 '기타'로
export function groupByCollege(departments: readonly Department[]): College[] {
  const byCode = new Map(departments.map((it) => [it.code, it]));
  const grouped = new Set<string>();

  const colleges = COLLEGE_DEPARTMENT_CODES.map(({ name, codes }) => ({
    name,
    departments: codes.flatMap((code) => {
      const department = byCode.get(code);
      if (!department) return [];
      grouped.add(code);
      return [department];
    }),
  }));

  const rest = departments.filter((it) => !grouped.has(it.code));
  if (rest.length > 0) colleges.push({ name: ETC_COLLEGE, departments: rest });

  return colleges.filter((college) => college.departments.length > 0);
}
