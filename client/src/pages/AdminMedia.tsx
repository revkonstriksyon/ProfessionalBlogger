import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Trash2, FileEdit, Eye, Image as ImageIcon, Video, Music, Download } from "lucide-react";
import { MEDIA_TYPES } from "@/lib/constants";
import type { Media } from "@shared/schema";

// Schema pou fòm media a
const mediaFormSchema = z.object({
  title: z.string().min(2, "Tit la dwe gen omwen 2 karaktè"),
  title_fr: z.string().min(2, "Tit fransè a dwe gen omwen 2 karaktè"),
  title_en: z.string().min(2, "Tit anglè a dwe gen omwen 2 karaktè"),
  description: z.string().optional(),
  description_fr: z.string().optional(),
  description_en: z.string().optional(),
  type: z.string(),
  url: z.string().optional(),
});

type MediaFormValues = z.infer<typeof mediaFormSchema>;

export default function AdminMedia() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form initialization
  const form = useForm<MediaFormValues>({
    resolver: zodResolver(mediaFormSchema),
    defaultValues: {
      title: "",
      title_fr: "",
      title_en: "",
      description: "",
      description_fr: "",
      description_en: "",
      type: "photo",
      url: "",
    },
  });

  // Chaje medya
  const { data: media, isLoading } = useQuery({
    queryKey: ['/api/admin/media'],
    queryFn: async () => {
      // Pandan n ap devlope, n ap itilize done "dummy" pou tès
      // Nan yon vèsyon reyèl, ou ta rele API a kòm sa:
      // return await apiRequest("/api/admin/media");
      
      return [
        {
          id: 1,
          title: "Cap-Haïtien: Bèl vil istorik nan nò Ayiti",
          title_fr: "Cap-Haïtien: Belle ville historique au nord d'Haïti",
          title_en: "Cap-Haitian: Beautiful historic city in northern Haiti",
          description: "Yon gade sou achitekti kolonyal ak bèl plaj Cap-Haïtien",
          description_fr: "Un regard sur l'architecture coloniale et les belles plages de Cap-Haïtien",
          description_en: "A look at the colonial architecture and beautiful beaches of Cap-Haitian",
          url: "https://images.unsplash.com/photo-1590093235218-2da990cb577e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2376&q=80",
          type: "photo",
          created_at: "2023-05-10T09:15:00Z"
        },
        {
          id: 2,
          title: "Citadelle Laferrière: Gwo fò militè Ayisyen",
          title_fr: "Citadelle Laferrière: Grande forteresse militaire haïtienne",
          title_en: "Citadelle Laferrière: Great Haitian military fortress",
          description: "Istwa ak bèlte Citadelle Laferrière, yon sit patrimwàn mondyal UNESCO",
          description_fr: "Histoire et beauté de la Citadelle Laferrière, un site du patrimoine mondial de l'UNESCO",
          description_en: "History and beauty of Citadelle Laferrière, a UNESCO World Heritage site",
          url: "https://images.unsplash.com/photo-1594413040364-08ce38682d38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80",
          type: "photo",
          created_at: "2023-05-10T09:15:00Z"
        },
        {
          id: 3,
          title: "Mizik Rasin: Soul nan mizik Ayisyen",
          title_fr: "Musique Racine: L'âme de la musique haïtienne",
          title_en: "Roots Music: The soul of Haitian music",
          description: "Koute son tradisyonèl mizik rasin ki melanje vodou ak enfliyans modèn",
          description_fr: "Écoutez les sons traditionnels de la musique racine mélangeant le vaudou et les influences modernes",
          description_en: "Listen to the traditional sounds of roots music blending voodoo and modern influences",
          url: "https://example.com/audio/mizik-rasin.mp3",
          type: "podcast",
          created_at: "2023-05-08T14:20:00Z"
        },
        {
          id: 4,
          title: "Dans Folklorik Ayisyen",
          title_fr: "Danse Folklorique Haïtienne",
          title_en: "Haitian Folk Dance",
          description: "Dokimantè sou riches dans folklorik Ayisyen",
          description_fr: "Documentaire sur la richesse de la danse folklorique haïtienne",
          description_en: "Documentary on the richness of Haitian folk dance",
          url: "https://example.com/videos/dans-folklorik.mp4",
          type: "video",
          created_at: "2023-05-05T10:30:00Z"
        }
      ] as Media[];
    }
  });

  // Filtre medya daprè tab aktif la
  const filteredMedia = media?.filter(item => {
    // Filtre pa tip
    if (activeTab !== "all" && item.type !== activeTab) {
      return false;
    }

    // Filtre pa rechèch
    if (searchQuery && 
      !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
      !item.title_fr.toLowerCase().includes(searchQuery.toLowerCase()) && 
      !item.title_en.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Fòmate dat
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('ht-HT', options);
  };
  
  // Jwenn icon pou tip medya
  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case 'photo':
        return <ImageIcon className="h-8 w-8 text-blue-500" />;
      case 'video':
        return <Video className="h-8 w-8 text-red-500" />;
      case 'podcast':
        return <Music className="h-8 w-8 text-purple-500" />;
      default:
        return <ImageIcon className="h-8 w-8 text-gray-500" />;
    }
  };
  
  // Mize an detay telechaje medya
  const uploadMediaMutation = useMutation({
    mutationFn: (data: MediaFormValues) => {
      // Nan yon vèsyon reyèl, ou ta rele API a kòm sa:
      // Ou ta gen bezwen yon lojik espesyal pou telechaje fichye
      // return apiRequest("/api/admin/media", {
      //   method: "POST",
      //   body: JSON.stringify(data)
      // });
      
      // Pou tès, n ap senpman retounen yon pwomès rezoud
      return Promise.resolve({ success: true });
    },
    onSuccess: () => {
      toast({
        title: "Siksè!",
        description: "Medya a telechaje avèk siksè",
      });
      
      // Fèmen dyalòg la ak ranplase done nan cache
      setIsUploadDialogOpen(false);
      form.reset();
      setSelectedImage(null);
      setImagePreview(null);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/media'] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erè",
        description: "Te gen yon pwoblèm pandan telechajman medya a",
      });
    }
  });
  
  // Mize an detay pou efase medya
  const deleteMediaMutation = useMutation({
    mutationFn: (mediaId: number) => {
      // Nan yon vèsyon reyèl, ou ta rele API a kòm sa:
      // return apiRequest(`/api/admin/media/${mediaId}`, {
      //   method: "DELETE"
      // });
      
      // Pou tès, n ap senpman retounen yon pwomès rezoud
      return Promise.resolve({ success: true });
    },
    onSuccess: () => {
      toast({
        title: "Siksè!",
        description: "Medya a efase avèk siksè",
      });
      
      // Ranplase done nan cache a
      setMediaToDelete(null);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/media'] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erè",
        description: "Te gen yon pwoblèm pandan efasman medya a",
      });
    }
  });

  // Manipile chanjman imaj
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Manipile soumisyon fòm
  const onSubmit = (data: MediaFormValues) => {
    // Si se yon imaj, ajoute nan fòm lan
    if (selectedImage) {
      // Nan yon vèsyon reyèl, ou ta mete kod pou telechaje imaj la
      data.url = imagePreview || "";
    }
    
    uploadMediaMutation.mutate(data);
  };

  // Manipile efasman medya
  const handleDeleteMedia = async (id: number) => {
    await deleteMediaMutation.mutate(id);
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Jere Medya</h1>
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Ajoute Nouvo Medya
          </Button>
        </div>

        <div className="flex items-center space-x-2 pb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Chèche medya..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">Tout</TabsTrigger>
            <TabsTrigger value="photo">Foto</TabsTrigger>
            <TabsTrigger value="video">Videyo</TabsTrigger>
            <TabsTrigger value="podcast">Podcast</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video">
                  <Skeleton className="h-full w-full" />
                </div>
                <CardContent className="pt-4">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-3 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMedia && filteredMedia.length > 0 ? (
              filteredMedia.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="relative aspect-video bg-muted flex items-center justify-center">
                    {item.type === 'photo' ? (
                      <img 
                        src={item.url} 
                        alt={item.title} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        {getMediaTypeIcon(item.type)}
                        <span className="mt-2 text-sm capitalize">{item.type}</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDate(item.created_at)}
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        {item.type === 'photo' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            asChild
                            className="h-8 w-8"
                          >
                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        
                        {(item.type === 'video' || item.type === 'podcast') && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            asChild
                            className="h-8 w-8"
                          >
                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-600"
                          onClick={() => setMediaToDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex justify-center py-8">
                <p className="text-muted-foreground">Pa gen medya ki koresponn ak kritè rechèch yo.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dyalòg ajoute medya */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ajoute Nouvo Medya</DialogTitle>
            <DialogDescription>
              Telechaje nouvo medya epi antre detay li yo.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <Tabs defaultValue="data" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="data">Telechaje</TabsTrigger>
                  <TabsTrigger value="details">Detay yo</TabsTrigger>
                </TabsList>
                
                <TabsContent value="data" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tip Medya</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chwazi tip medya a" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="photo">Foto</SelectItem>
                            <SelectItem value="video">Videyo</SelectItem>
                            <SelectItem value="podcast">Podcast</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch("type") === "photo" ? (
                    <div className="space-y-4">
                      <div>
                        <FormLabel>Imaj</FormLabel>
                        {imagePreview && (
                          <div className="my-4 border rounded-md overflow-hidden">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="w-full h-48 object-cover" 
                            />
                          </div>
                        )}
                        <Input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageChange}
                          className="mt-2"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          Rekòmande: 1200 × 630 piksèl, 2MB maksimòm
                        </p>
                      </div>
                    </div>
                  ) : (
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL {form.watch("type") === "video" ? "Videyo" : "Podcast"}</FormLabel>
                          <FormControl>
                            <Input placeholder={`Antre URL ${form.watch("type") === "video" ? "videyo" : "podcast"} a`} {...field} />
                          </FormControl>
                          <FormDescription>
                            URL ki dirèkteman aksesib pou {form.watch("type") === "video" ? "videyo" : "podcast"} a
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="details" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tit (Kreyòl)</FormLabel>
                        <FormControl>
                          <Input placeholder="Antre tit medya a an kreyòl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="title_fr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tit (Fransè)</FormLabel>
                        <FormControl>
                          <Input placeholder="Antre tit medya a an fransè" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="title_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tit (Anglè)</FormLabel>
                        <FormControl>
                          <Input placeholder="Antre tit medya a an anglè" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deskripsyon (Kreyòl)</FormLabel>
                        <FormControl>
                          <Input placeholder="Antre deskripsyon medya a an kreyòl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description_fr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deskripsyon (Fransè)</FormLabel>
                        <FormControl>
                          <Input placeholder="Antre deskripsyon medya a an fransè" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deskripsyon (Anglè)</FormLabel>
                        <FormControl>
                          <Input placeholder="Antre deskripsyon medya a an anglè" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
              
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={uploadMediaMutation.isPending}
                  className="w-full"
                >
                  {uploadMediaMutation.isPending ? "Ankou..." : "Telechaje Medya"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dyalòg konfirmasyon efasman */}
      <AlertDialog open={!!mediaToDelete} onOpenChange={() => setMediaToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Èske ou sèten ou vle efase medya sa a?</AlertDialogTitle>
            <AlertDialogDescription>
              Aksyon sa a pa kapab anile. Sa pral efase medya a pou tout tan nan baz done a.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anile</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => mediaToDelete && handleDeleteMedia(mediaToDelete)}
            >
              Efase
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}