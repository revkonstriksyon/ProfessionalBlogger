import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, FileText, Users, Image as ImageIcon, MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

interface DashboardStats {
  totalArticles: number;
  totalCategories: number;
  totalMedia: number;
  totalComments: number;
  recentArticles: Array<{
    id: number;
    title: string;
    createdAt: string;
    slug: string;
  }>;
}

export default function AdminDashboard() {
  const [, navigate] = useLocation();

  // Chaje estatistik tablo debò a
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/admin/dashboard'],
    queryFn: async () => {
      // Pandan n ap devlope, n ap itilize done "dummy" pou tès
      // Nan yon vèsyon reyèl, ou ta rele API a kòm sa: 
      // return await apiRequest("/api/admin/dashboard");
      
      // Done tès pou devlopman sèlman
      return {
        totalArticles: 24,
        totalCategories: 8,
        totalMedia: 45,
        totalComments: 156,
        recentArticles: [
          {
            id: 1,
            title: "Nouvo inisyativ pou agrikilti Ayiti",
            createdAt: "2023-05-15T10:30:00Z",
            slug: "nouvo-inisyativ-pou-agrikilti-ayiti"
          },
          {
            id: 2,
            title: "Touris nan Ayiti: Dekouvri bèl plaj yo",
            createdAt: "2023-05-12T14:20:00Z",
            slug: "touris-nan-ayiti-dekouvri-bel-plaj-yo"
          },
          {
            id: 3,
            title: "Eleksyon pwochen: Sa k ap pase",
            createdAt: "2023-05-10T09:15:00Z",
            slug: "eleksyon-pwochen-sa-k-ap-pase"
          }
        ]
      } as DashboardStats;
    }
  });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('ht-HT', options);
  };

  // Stats card component
  const StatCard = ({ 
    title, 
    value, 
    icon, 
    description, 
    onClick 
  }: { 
    title: string; 
    value: number | string; 
    icon: JSX.Element; 
    description: string; 
    onClick?: () => void; 
  }) => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-20" /> : value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Tablo Debò Admin</h1>
          <Button onClick={() => navigate("/admin/articles/new")}>
            Ajoute Nouvo Atik
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Atik" 
            value={stats?.totalArticles || 0} 
            icon={<FileText size={16} />}
            description="Kantite atik pibliye"
            onClick={() => navigate("/admin/articles")}
          />
          <StatCard 
            title="Kategori" 
            value={stats?.totalCategories || 0} 
            icon={<BarChart size={16} />}
            description="Kategori atik yo"
            onClick={() => navigate("/admin/categories")}
          />
          <StatCard 
            title="Medya" 
            value={stats?.totalMedia || 0} 
            icon={<ImageIcon size={16} />}
            description="Imaj ak videyoweb yo"
            onClick={() => navigate("/admin/media")}
          />
          <StatCard 
            title="Kòmantè" 
            value={stats?.totalComments || 0} 
            icon={<MessageSquare size={16} />}
            description="Kòmantè itilizatè yo"
            onClick={() => navigate("/admin/comments")}
          />
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Dènye Atik yo</CardTitle>
              <CardDescription>Wè dènye atik pibliye yo</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {stats?.recentArticles.map((article) => (
                    <div 
                      key={article.id} 
                      className="flex justify-between items-center p-2 rounded-md hover:bg-muted cursor-pointer"
                      onClick={() => navigate(`/admin/articles/edit/${article.id}`)}
                    >
                      <div>
                        <div className="font-medium">{article.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(article.createdAt)}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <FileText size={16} />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => navigate("/admin/articles")}
                  >
                    Wè Tout Atik
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Gid Rapid</CardTitle>
              <CardDescription>Aksyon rapid pou jere kontni sit la</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start text-left" 
                onClick={() => navigate("/admin/articles/new")}
              >
                <FileText className="mr-2 h-4 w-4" />
                Kreye yon nouvo atik
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left"
                onClick={() => navigate("/admin/categories/new")}
              >
                <BarChart className="mr-2 h-4 w-4" />
                Ajoute yon kategori
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left"
                onClick={() => navigate("/admin/media/upload")}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Telechaje medya
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left"
                onClick={() => navigate("/admin/settings")}
              >
                <Users className="mr-2 h-4 w-4" />
                Jere itilizatè
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}