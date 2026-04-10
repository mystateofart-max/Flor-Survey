import { getResponses } from '@/lib/db';
import SurveyForm from '@/components/SurveyForm';

export const dynamic = 'force-dynamic';

export default async function Page() {
  let count = 0;
  try {
    const responses = await getResponses();
    count = responses.filter(r => r.survey_completed).length;
  } catch (err) {
    console.error('Failed to fetch response count:', err);
  }

  return (
    <main className="page-container">
      <SurveyForm initialCount={count} />
    </main>
  );
}
