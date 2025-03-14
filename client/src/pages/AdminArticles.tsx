import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { apiRequest } from "@/lib/queryClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Plus, Search, FileEdit, Trash2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { Article } from "@shared/schema";

export default function AdminArticles() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [articleToDelete, setArticleToDelete] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Chaje lis atik yo
  const { data: articles, isLoading } = useQuery({
    queryKey: ['/api/admin/articles'],
    queryFn: async () => {
      // Pandan n ap devlope, n ap itilize done "dummy" pou tès
      // Nan yon vèsyon reyèl, ou ta rele API a kòm sa:
      // return await apiRequest("/api/admin/articles");
      
      return [
        {
          id: 1,
          title: "Nouvo inisyativ pou agrikilti Ayiti",
          title_fr: "Nouvelle initiative pour l'agriculture haïtienne",
          title_en: "New initiative for Haiti's agriculture",
          slug: "nouvo-inisyativ-pou-agrikilti-ayiti",
          content: "Kontni atik la...",
          published: true,
          featured: true,
          category_id: 1,
          author_id: 1,
          views: 230,
          created_at: "2023-05-15T10:30:00Z",
          updated_at: "2023-05-15T10:30:00Z"
        },
        {
          id: 2,
          title: "Touris nan Ayiti: Dekouvri bèl plaj yo",
          title_fr: "Tourisme en Haïti: Découvrez les belles plages",
          title_en: "Tourism in Haiti: Discover the beautiful beaches",
          slug: "touris-nan-ayiti-dekouvri-bel-plaj-yo",
          content: "Kontni atik la...",
          published: true,
          featured: false,
          category_id: 2,
          author_id: 1,
          views: 185,
          created_at: "2023-05-12T14:20:00Z",
          updated_at: "2023-05-12T14:20:00Z"
        },
        {
          id: 3,
          title: "Eleksyon pwochen: Sa k ap pase",
          title_fr: "Prochaines élections: Ce qui se passe",
          title_en: "Upcoming elections: What's happening",
          slug: "eleksyon-pwochen-sa-k-ap-pase",
          content: "Kontni atik la...",
          published: true,
          featured: false,
          category_id: 3,
          author_id: 1,
          views: 320,
          created_at: "2023-05-10T09:15:00Z",
          updated_at: "2023-05-10T09:15:00Z"
        }
      ] as Article[];
    }
  });

  // Mize an detay pou efase atik
  const deleteMutation = useMutation({
    mutationFn: (articleId: number) => {
      // Nan yon vèsyon reyèl, ou ta rele API a kòm sa:
      // return apiRequest(`/api/admin/articles/${articleId}`, {
      //   method: "DELETE"
      // });
      
      // Pou tès, n ap senpman retounen yon pwomès rezoud
      return Promise.resolve({ success: true });
    },
    onSuccess: () => {
      toast({
        title: "Siksè!",
        description: "Atik la efase avèk siksè",
      });
      
      // Ranplase done nan cache a
      queryClient.invalidateQueries({ queryKey: ['/api/admin/articles'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard'] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erè",
        description: "Te gen yon pwoblèm pandan efasman atik la",
      });
    }
  });

  const handleDeleteArticle = async (id: number) => {
    await deleteMutation.mutate(id);
    setArticleToDelete(null);
  };

  // Filtre atik yo baze sou rechèch
  const filteredArticles = articles?.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.title_fr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.title_en.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fòmate dat
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('ht-HT', options);
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Jere Atik yo</h1>
          <Button onClick={() => navigate("/admin/articles/new")}>
            <Plus className="mr-2 h-4 w-4" /> Ajoute Nouvo Atik
          </Button>
        </div>

        <div className="flex items-center space-x-2 pb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Chèche atik..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tit</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Estati</TableHead>
                  <TableHead>Dat Piblikasyon</TableHead>
                  <TableHead>Vizit</TableHead>
                  <TableHead className="text-right">Aksyon</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles && filteredArticles.length > 0 ? (
                  filteredArticles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">{article.title}</TableCell>
                      <TableCell>
                        {article.category_id === 1 ? "Agrikilti" : 
                         article.category_id === 2 ? "Touris" : 
                         article.category_id === 3 ? "Politik" : "Lòt"}
                      </TableCell>
                      <TableCell>
                        {article.published ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                            Pibliye
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                            Bouyon
                          </Badge>
                        )}
                        {article.featured && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 ml-2">
                            Anfòm
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(article.created_at)}</TableCell>
                      <TableCell>{article.views}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Ouvri menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksyon</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate(`/article/${article.slug}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Gade
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/admin/articles/edit/${article.id}`)}>
                              <FileEdit className="mr-2 h-4 w-4" />
                              Modifye
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600" 
                              onClick={() => setArticleToDelete(article.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Efase
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Okenn atik pa jwenn.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Dyalòg konfimasyon pou efase atik */}
      <AlertDialog open={!!articleToDelete} onOpenChange={() => setArticleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Èske ou sèten ou vle efase atik sa a?</AlertDialogTitle>
            <AlertDialogDescription>
              Aksyon sa a pa kapab anile. Sa pral efase atik la pou tout tan nan baz done a.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anile</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => articleToDelete && handleDeleteArticle(articleToDelete)}
            >
              Efase
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}