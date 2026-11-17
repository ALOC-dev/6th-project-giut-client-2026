export type ContestCategory =
    | '공모전'
    | '대외활동'
    | '해커톤'
    | '경진대회'
    | '서포터즈'
    | '봉사'
    | '인턴'
    | '교육';

export type ParticipationType= 'individual'| 'team' | 'both';

export type Contest ={
    id: string;
    title: string;
    host: string;
    participationType: ParticipationType;
    category: ContestCategory;
    field: string;
    targets: string[];
    benefit: string;
    sourceUrl: string;
    sourceName: string;
    posterUrl: string;
    startDate: string;
    endDate: string;
    description: string;
};