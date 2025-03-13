import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { POPULAR_TAGS } from '@/lib/constants';

export default function TagsSection() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif font-bold text-lg pb-2 border-b text-[#0D47A1]">
          {t('tags.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {POPULAR_TAGS.map(({ key, labelKey }) => (
            <Link key={key} href={`/tag/${key}`}>
              <a className="px-3 py-1 bg-gray-100 hover:bg-[#0D47A1] hover:text-white rounded-full text-sm transition">
                {t(labelKey)}
              </a>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
