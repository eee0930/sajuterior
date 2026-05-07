import type {
  UserProfile, Element5, ElementCount,
  CoupleAnalysis, CoupleElementAnalysis, ElementStatus,
} from '../types';

const ELEMENTS: Element5[] = ['목', '화', '토', '금', '수'];

function isLacking(count: number, total: number): boolean {
  return count < (total / 5) * 0.55;
}

function isAbundant(count: number, total: number): boolean {
  return count > (total / 5) * 1.5;
}

export function analyzeCoupleElements(p1: UserProfile, p2: UserProfile): CoupleAnalysis {
  const ec1 = p1.saju.elementCount;
  const ec2 = p2.saju.elementCount;
  const total1 = p1.saju.hourPillar ? 8 : 6;
  const total2 = p2.saju.hourPillar ? 8 : 6;
  const totalCombined = total1 + total2;

  const combined: ElementCount = {
    목: ec1.목 + ec2.목,
    화: ec1.화 + ec2.화,
    토: ec1.토 + ec2.토,
    금: ec1.금 + ec2.금,
    수: ec1.수 + ec2.수,
  };

  const elementDetails: CoupleElementAnalysis[] = ELEMENTS.map(el => {
    const p1Lacks = isLacking(ec1[el], total1);
    const p2Lacks = isLacking(ec2[el], total2);
    const combinedLacks = isLacking(combined[el], totalCombined);
    const combinedAbundant = isAbundant(combined[el], totalCombined);

    let status: ElementStatus;
    if (combinedAbundant) {
      status = 'abundant';
    } else if (combinedLacks) {
      status = 'both-lacking';
    } else if (p1Lacks || p2Lacks) {
      // one person lacks but combined is OK → complementary
      status = 'complementary';
    } else {
      status = 'balanced';
    }

    return { element: el, p1Count: ec1[el], p2Count: ec2[el], combinedCount: combined[el], status };
  });

  const complementaryElements = elementDetails.filter(d => d.status === 'complementary').map(d => d.element);
  const lackingElements = elementDetails.filter(d => d.status === 'both-lacking').map(d => d.element);
  const abundantElements = elementDetails.filter(d => d.status === 'abundant').map(d => d.element);

  const compatibilityLevel =
    complementaryElements.length >= 3 ? 'great' :
    complementaryElements.length >= 1 ? 'good' :
    'neutral';

  return {
    combinedElementCount: combined,
    elementDetails,
    complementaryElements,
    lackingElements,
    abundantElements,
    compatibilityLevel,
    totalChars: totalCombined,
  };
}
