import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AdminLayout from "@/components/admin/AdminLayout";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Card, CardContent } from "@/components/ui/card";
import { insertArticleSchema, Article } from "@shared/schema";
import { ArrowLeft, Save } from "lucide-react";

// Estandje schema atik la pou fòm lan
const articleFormSchema = insertArticleSchema.extend({
  // Ajoute validasyon siplemantè si ou bezwen
  title: z.string().min(5, "Tit la dwe genyen omwen 5 karaktè"),
  title_fr: z.string().min(5, "Tit fransè a dwe genyen omwen 5 karaktè"),
  title_en: z.string().min(5, "Tit anglè a dwe genyen omwen 5 karaktè"),
  content: z.string().min(50, "Kontni a dwe genyen omwen 50 karaktè"),
  content_fr: z.string().min(50, "Kontni fransè a dwe genyen omwen 50 karaktè"),
  content_en: z.string().min(50, "Kontni anglè a dwe genyen omwen 50 karaktè"),
});

// Tip fòm pou atik
type ArticleFormValues = z.infer<typeof articleFormSchema>;

export default function AdminArticleForm() {
  const params = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditMode = !!params.id;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Form setup
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: "",
      title_fr: "",
      title_en: "",
      slug: "",
      content: "",
      content_fr: "",
      content_en: "",
      excerpt: "",
      excerpt_fr: "",
      excerpt_en: "",
      published: false,
      featured: false,
      category_id: 1,
      author_id: 1,
      tags: [],
      read_time: 5
    },
  });

  // Chaje kategori pou seleksyon
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      // Pandan n ap devlope, n ap itilize done "dummy" pou tès
      return [
        { id: 1, name: "Agrikilti", slug: "agrikilti" },
        { id: 2, name: "Politik", slug: "politik" },
        { id: 3, name: "Touris", slug: "touris" },
        { id: 4, name: "Edikasyon", slug: "edikasyon" },
        { id: 5, name: "Ekonomi", slug: "ekonomi" },
        { id: 6, name: "Kilti", slug: "kilti" },
        { id: 7, name: "Espò", slug: "espo" },
        { id: 8, name: "Teknoloji", slug: "teknoloji" }
      ];
    }
  });

  // Si an mod edisyon, chaje done atik la
  const { data: article, isLoading: isLoadingArticle } = useQuery({
    queryKey: ['/api/admin/articles', params.id],
    queryFn: async () => {
      if (!isEditMode) return null;
      
      // Pandan n ap devlope, n ap itilize done "dummy" pou tès
      // Nan yon vèsyon reyèl, ou ta rele API a kòm sa:
      // return await apiRequest(`/api/admin/articles/${params.id}`);
      
      return {
        id: parseInt(params.id),
        title: "Nouvo inisyativ pou agrikilti Ayiti",
        title_fr: "Nouvelle initiative pour l'agriculture haïtienne",
        title_en: "New initiative for Haiti's agriculture",
        slug: "nouvo-inisyativ-pou-agrikilti-ayiti",
        content: "Gouvènman an te lanse yon nouvo pwogram pou ede agrikilti nan peyi a. Pwogram sa a gen ladan sibvansyon pou ekipman, semans ak fòmasyon pou kiltivatè yo. Objektif la se ogmante pwodiktivite ak kalite rekòt yo, amelyore kondisyon lavi nan zòn riral yo, epi redwi depandans peyi a sou enpòtasyon manje.\n\nMinistè Agrikilti a te anonse tou ke yo pral travay avèk òganizasyon entènasyonal yo pou jwenn plis sipò teknik ak finansye. Yo prevwa ke pwogram nan ap benefisye plis pase 100,000 kiltivatè nan 5 lane k ap vini yo.",
        content_fr: "Le gouvernement a lancé un nouveau programme pour aider l'agriculture dans le pays. Ce programme comprend des subventions pour l'équipement, les semences et la formation des agriculteurs. L'objectif est d'augmenter la productivité et la qualité des récoltes, d'améliorer les conditions de vie dans les zones rurales et de réduire la dépendance du pays aux importations alimentaires.\n\nLe ministère de l'Agriculture a également annoncé qu'il travaillera avec des organisations internationales pour obtenir un soutien technique et financier supplémentaire. On estime que le programme bénéficiera à plus de 100 000 agriculteurs au cours des 5 prochaines années.",
        content_en: "The government has launched a new program to support agriculture in the country. This program includes subsidies for equipment, seeds, and training for farmers. The goal is to increase productivity and crop quality, improve living conditions in rural areas, and reduce the country's dependence on food imports.\n\nThe Ministry of Agriculture also announced that they will work with international organizations to get more technical and financial support. It is expected that the program will benefit more than 100,000 farmers over the next 5 years.",
        excerpt: "Gouvènman an te lanse yon nouvo pwogram pou ede agrikilti nan peyi a, ki gen ladan sibvansyon pou ekipman, semans ak fòmasyon.",
        excerpt_fr: "Le gouvernement a lancé un nouveau programme pour aider l'agriculture dans le pays, comprenant des subventions pour l'équipement, les semences et la formation.",
        excerpt_en: "The government has launched a new program to support agriculture in the country, including subsidies for equipment, seeds, and training.",
        published: true,
        featured: true,
        category_id: 1,
        author_id: 1,
        image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        tags: ["agrikilti", "gouvènman", "devlopman", "ekonomi"],
        read_time: 5,
        views: 230,
        created_at: "2023-05-15T10:30:00Z",
        updated_at: "2023-05-15T10:30:00Z"
      } as Article;
    },
    enabled: isEditMode,
  });

  // Mete fòm nan avèk done atik la lè yo chaje
  useEffect(() => {
    if (article && isEditMode) {
      form.reset({
        title: article.title,
        title_fr: article.title_fr,
        title_en: article.title_en,
        slug: article.slug,
        content: article.content,
        content_fr: article.content_fr || "",
        content_en: article.content_en || "",
        excerpt: article.excerpt,
        excerpt_fr: article.excerpt_fr || "",
        excerpt_en: article.excerpt_en || "",
        published: article.published,
        featured: article.featured,
        category_id: article.category_id,
        author_id: article.author_id,
        tags: article.tags,
        read_time: article.read_time
      });
      
      if (article.image) {
        setSelectedImage(article.image);
        setImagePreview(article.image);
      }
    }
  }, [article, form, isEditMode]);

  // Manipile chanjman imaj
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Fonksyonalite sovgade
  const saveArticleMutation = useMutation({
    mutationFn: (data: ArticleFormValues) => {
      if (isEditMode) {
        // Nan yon vèsyon reyèl, ou ta rele API a kòm sa:
        // return apiRequest(`/api/admin/articles/${params.id}`, {
        //   method: "PUT",
        //   body: JSON.stringify(data)
        // });
        
        // Pou tès, n ap senpman retounen yon pwomès rezoud
        return Promise.resolve({ success: true });
      } else {
        // Nan yon vèsyon reyèl, ou ta rele API a kòm sa:
        // return apiRequest("/api/admin/articles", {
        //   method: "POST",
        //   body: JSON.stringify(data)
        // });
        
        // Pou tès, n ap senpman retounen yon pwomès rezoud
        return Promise.resolve({ success: true });
      }
    },
    onSuccess: () => {
      toast({
        title: "Siksè!",
        description: isEditMode ? "Atik la modifye avèk siksè" : "Atik la kreye avèk siksè",
      });
      
      // Ranplase done nan cache a
      queryClient.invalidateQueries({ queryKey: ['/api/admin/articles'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard'] });
      
      // Redirije vè lis atik yo
      navigate("/admin/articles");
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erè",
        description: "Te gen yon pwoblèm pandan sovgad atik la",
      });
    }
  });

  const onSubmit = (data: ArticleFormValues) => {
    // Si slug la vid, kreye youn pa otomatik soti nan tit la
    if (!data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
    }
    
    // Ajoute imaj si li chwazi
    if (selectedImage) {
      data = { ...data, image: selectedImage };
    }
    
    saveArticleMutation.mutate(data);
  };

  // Konwole valè tagging
  const handleTagChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      
      const target = event.target as HTMLInputElement;
      const value = target.value.trim();
      
      if (!value) return;
      
      // Jwenn valè aktyèl yo
      const currentTags = form.getValues().tags || [];
      
      // Ajoute nouvo tag si li pa deja nan lis la
      if (!currentTags.includes(value)) {
        form.setValue('tags', [...currentTags, value]);
      }
      
      // Efase chan antre a
      target.value = '';
    }
  };

  // Elimine tag
  const removeTag = (tag: string) => {
    const currentTags = form.getValues().tags || [];
    form.setValue('tags', currentTags.filter(t => t !== tag));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => navigate("/admin/articles")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">
              {isEditMode ? "Modifye Atik" : "Kreye Nouvo Atik"}
            </h1>
          </div>
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            disabled={saveArticleMutation.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            {saveArticleMutation.isPending ? "Ankou..." : "Sovgade"}
          </Button>
        </div>

        <Form {...form}>
          <form className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <Tabs defaultValue="ht" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="ht">Kreyòl</TabsTrigger>
                    <TabsTrigger value="fr">Fransè</TabsTrigger>
                    <TabsTrigger value="en">Anglè</TabsTrigger>
                  </TabsList>
                  
                  {/* Tab Kreyòl */}
                  <TabsContent value="ht" className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tit (Kreyòl)</FormLabel>
                          <FormControl>
                            <Input placeholder="Antre tit atik la an kreyòl" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="excerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rezime (Kreyòl)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Yon ti rezime kout de atik la an kreyòl"
                              {...field}
                              rows={3}
                            />
                          </FormControl>
                          <FormDescription>
                            Yon deskripsyon kout (2-3 fraz) ki ap parèt nan paj endèks ak rezilta rechèch yo.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kontni (Kreyòl)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Kontni konplè atik la an kreyòl"
                              {...field}
                              rows={10}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  {/* Tab Fransè */}
                  <TabsContent value="fr" className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="title_fr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tit (Fransè)</FormLabel>
                          <FormControl>
                            <Input placeholder="Antre tit atik la an fransè" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="excerpt_fr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rezime (Fransè)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Yon ti rezime kout de atik la an fransè"
                              {...field}
                              rows={3}
                            />
                          </FormControl>
                          <FormDescription>
                            Yon deskripsyon kout (2-3 fraz) ki ap parèt nan paj endèks ak rezilta rechèch yo.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="content_fr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kontni (Fransè)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Kontni konplè atik la an fransè"
                              {...field}
                              rows={10}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  
                  {/* Tab Anglè */}
                  <TabsContent value="en" className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="title_en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tit (Anglè)</FormLabel>
                          <FormControl>
                            <Input placeholder="Antre tit atik la an anglè" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="excerpt_en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rezime (Anglè)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Yon ti rezime kout de atik la an anglè"
                              {...field}
                              rows={3}
                            />
                          </FormControl>
                          <FormDescription>
                            Yon deskripsyon kout (2-3 fraz) ki ap parèt nan paj endèks ak rezilta rechèch yo.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="content_en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kontni (Anglè)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Kontni konplè atik la an anglè"
                              {...field}
                              rows={10}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Non URL-friendly (eg: nouvo-atik-mwen)" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Idantifyan inik pou URL atik la. Si ou kite l vid, li pral jenere otomatikman soti nan tit la.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kategori</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chwazi yon kategori" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories?.map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="read_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tan Lekti (minit)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            max="60"
                            placeholder="5" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <FormLabel>Tag yo</FormLabel>
                    <div className="flex flex-wrap gap-2 mt-2 mb-2">
                      {form.getValues().tags?.map((tag) => (
                        <div 
                          key={tag} 
                          className="bg-primary/10 px-2 py-1 rounded-md text-sm flex items-center"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-muted-foreground hover:text-foreground"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <Input 
                      placeholder="Tape yon tag epi peze Enter" 
                      onKeyDown={handleTagChange}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Tape yon tag epi peze Enter oswa virgil (,) pou ajoute l.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <FormLabel>Imaj Metadone</FormLabel>
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
                  
                  <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Pibliye</FormLabel>
                          <FormDescription>
                            Si tcheke, atik la ap vizib pou tout itilizatè yo. Sinon, li ap sovgade kòm yon bouyon.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Anfòm</FormLabel>
                          <FormDescription>
                            Si tcheke, atik la ap parèt nan seksyon "Anfòm" sou paj akèy la.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}