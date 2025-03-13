import React from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data for the blog section
const blogPosts = [
  {
    id: 1,
    author: {
      name: "Sophia Martelly",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
      role: "Analiz Politik"
    },
    publishedAt: "2023-08-12",
    title: {
      ht: "Analiz: Ki Avni pou Refòm Politik yo ann Ayiti?",
      fr: "Analyse : Quel avenir pour les réformes politiques en Haïti ?",
      en: "Analysis: What Future for Political Reforms in Haiti?"
    },
    content: {
      ht: "Nan dènye mwa yo, nou te wè anpil diskisyon sou posib refòm politik nan peyi a. Kesyon an se: èske refòm sa yo ka pote chanjman reyèl, oswa y ap rete nan nivo diskou sèlman? Lè nou gade istwa politik Ayiti, nou ka wè ke...",
      fr: "Ces derniers mois, nous avons assisté à de nombreuses discussions sur d'éventuelles réformes politiques dans le pays. La question est : ces réformes peuvent-elles apporter un réel changement, ou resteront-elles au niveau du discours ? Lorsque nous examinons l'histoire politique d'Haïti, nous pouvons voir que...",
      en: "In recent months, we have seen many discussions about possible political reforms in the country. The question is: can these reforms bring real change, or will they remain at the level of discourse only? When we look at Haiti's political history, we can see that..."
    },
    stats: {
      views: 245,
      comments: 18,
      likes: 56
    }
  },
  {
    id: 2,
    author: {
      name: "Jean Baptiste",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
      role: "Analiz Ekonomik"
    },
    publishedAt: "2023-08-08",
    title: {
      ht: "Ekonomi Ayiti: Opòtinite ak Defi pou Kwasans nan 2023",
      fr: "Économie haïtienne : Opportunités et défis pour la croissance en 2023",
      en: "Haiti's Economy: Opportunities and Challenges for Growth in 2023"
    },
    content: {
      ht: "Ekonomi Ayiti a ap fè fas a anpil defi, men gen kèk siy pozitif ki ta ka sijere yon chemen vè rekiperasyon. Sektè agrikòl la, ki toujou rete pilye ekonomi a, montre potansyèl pou plis kwasans si li resevwa envestisman ki nesesè...",
      fr: "L'économie haïtienne est confrontée à de nombreux défis, mais certains signes positifs pourraient suggérer une voie vers le rétablissement. Le secteur agricole, qui reste un pilier de l'économie, montre un potentiel de croissance supplémentaire s'il reçoit les investissements nécessaires...",
      en: "Haiti's economy faces many challenges, but there are some positive signs that could suggest a path to recovery. The agricultural sector, which remains a pillar of the economy, shows potential for further growth if it receives the necessary investment..."
    },
    stats: {
      views: 183,
      comments: 12,
      likes: 42
    }
  }
];

const BlogSection: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  return (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-2xl font-bold text-primary">{t('blog.title')}</h2>
        <Link href="/blog">
          <a className="text-accent hover:underline font-semibold">
            {t('blog.allAnalysis')} <i className="fas fa-arrow-right ml-1"></i>
          </a>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {blogPosts.map((post, index) => (
          <article 
            key={post.id} 
            className={`${index < blogPosts.length - 1 ? 'mb-8 pb-8 border-b border-gray-200' : ''}`}
          >
            <div className="flex items-center mb-4">
              <img 
                src={post.author.image} 
                alt={post.author.name} 
                className="w-12 h-12 rounded-full mr-4" 
              />
              <div>
                <h4 className="font-bold text-gray-800">{post.author.name}</h4>
                <p className="text-sm text-gray-600">
                  {post.author.role} | {new Date(post.publishedAt).toLocaleDateString(
                    language === 'en' ? 'en-US' : language === 'fr' ? 'fr-FR' : 'ht'
                  )}
                </p>
              </div>
            </div>
            
            <Link href={`/blog/${post.id}`}>
              <a>
                <h3 className="font-heading font-bold text-xl mb-3 hover:text-accent">
                  {post.title[language]}
                </h3>
              </a>
            </Link>
            
            <p className="text-gray-700 mb-4">{post.content[language]}</p>
            
            <Link href={`/blog/${post.id}`}>
              <a className="text-accent hover:underline font-semibold">
                {t('blog.readMore')} <i className="fas fa-long-arrow-alt-right ml-1"></i>
              </a>
            </Link>
            
            <div className="flex items-center mt-4 text-sm text-gray-600">
              <span className="mr-4">
                <i className="far fa-eye mr-1"></i> {post.stats.views} {t('blog.views')}
              </span>
              <span className="mr-4">
                <i className="far fa-comment mr-1"></i> {post.stats.comments} {t('blog.comments')}
              </span>
              <span>
                <i className="far fa-heart mr-1"></i> {post.stats.likes} {t('blog.likes')}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;
