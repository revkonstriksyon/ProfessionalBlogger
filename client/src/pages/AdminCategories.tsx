import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AdminLayout from "@/components/admin/AdminLayout";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Trash2 } from "lucide-react";
import type { Category } from "@shared/schema";

// Schema pou fòm kategori a
const categoryFormSchema = z.object({
  name: z.string().min(2, "Non an dwe gen omwen 2 karaktè"),
  name_fr: z.string().min(2, "Non fransè a dwe gen omwen 2 karaktè"),
  name_en: z.string().min(2, "Non anglè a dwe gen omwen 2 karaktè"),
  slug: z.string().optional(),
  description: z.string().optional(),
  description_fr: z.string().optional(),
  description_en: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export default function AdminCategories() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  // Fòm kategori
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      name_fr: "",
      name_en: "",
      slug: "",
      description: "",
      description_fr: "",
      description_en: "",
    },
  });

  // Fòm edisyon kategori
  const editForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      name_fr: "",
      name_en: "",
      slug: "",
      description: "",
      description_fr: "",
      description_en: "",
    },
  });

  // Chaje kategori yo
  const { data: categories, isLoading } = useQuery({
    queryKey: ['/api/admin/categories'],
    queryFn: async () => {
      // Pandan n ap devlope, n ap itilize done "dummy" pou tès
      // Nan yon vèsyon reyèl, ou ta rele API a kòm sa:
      // return await apiRequest("/api/admin/categories");
      
      return [
        {
          id: 1,
          name: "Agrikilti", 
          name_fr: "Agriculture", 
          name_en: "Agriculture",
          slug: "agrikilti",
          description: "Atik sou agrikilti ak pwodiktivite manje nan Ayiti",
          description_fr: "Articles sur l'agriculture et la productivité alimentaire en Haïti",
          description_en: "Articles about agriculture and food productivity in Haiti"
        },
        {
          id: 2,
          name: "Politik", 
          name_fr: "Politique", 
          name_en: "Politics",
          slug: "politik",
          description: "Aktyalite politik nan peyi a ak entènasyonal",
          description_fr: "Actualité politique nationale et internationale",
          description_en: "National and international political news"
        },
        {
          id: 3,
          name: "Touris", 
          name_fr: "Tourisme", 
          name_en: "Tourism",
          slug: "touris",
          description: "Dekouvri bèl plas touristik peyi a ak opòtinite yo ofri",
          description_fr: "Découvrez les beaux sites touristiques du pays et les opportunités qu'ils offrent",
          description_en: "Discover the beautiful tourist places of the country and the opportunities they offer"
        },
        {
          id: 4,
          name: "Edikasyon", 
          name_fr: "Éducation", 
          name_en: "Education",
          slug: "edikasyon",
          description: "Tout sa ki gen rapò ak edikasyon ak fòmasyon",
          description_fr: "Tout ce qui concerne l'éducation et la formation",
          description_en: "Everything related to education and training"
        }
      ] as Category[];
    }
  });

  // Ajoute yon nouvo kategori
  const addCategoryMutation = useMutation({
    mutationFn: (data: CategoryFormValues) => {
      // Nan yon vèsyon reyèl, ou ta rele API a kòm sa:
      // return apiRequest("/api/admin/categories", {
      //   method: "POST",
      //   body: JSON.stringify(data)
      // });
      
      // Pou tès, n ap senpman retounen yon pwomès rezoud
      return Promise.resolve({ success: true });
    },
    onSuccess: () => {
      toast({
        title: "Siksè!",
        description: "Kategori a kreye avèk siksè",
      });
      
      // Fèmen dyalòg la ak ranplase done nan cache
      setIsAddDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/admin/categories'] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erè",
        description: "Te gen yon pwoblèm pandan kreyasyon kategori a",
      });
    }
  });

  // Mize a jou yon kategori
  const updateCategoryMutation = useMutation({
    mutationFn: (data: { id: number; values: CategoryFormValues }) => {
      // Nan yon vèsyon reyèl, ou ta rele API a kòm sa:
      // return apiRequest(`/api/admin/categories/${data.id}`, {
      //   method: "PUT",
      //   body: JSON.stringify(data.values)
      // });
      
      // Pou tès, n ap senpman retounen yon pwomès rezoud
      return Promise.resolve({ success: true });
    },
    onSuccess: () => {
      toast({
        title: "Siksè!",
        description: "Kategori a modifye avèk siksè",
      });
      
      // Fèmen dyalòg la ak ranplase done nan cache
      setIsEditDialogOpen(false);
      setCategoryToEdit(null);
      editForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/admin/categories'] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erè",
        description: "Te gen yon pwoblèm pandan mizajou kategori a",
      });
    }
  });

  // Efase yon kategori
  const deleteCategoryMutation = useMutation({
    mutationFn: (categoryId: number) => {
      // Nan yon vèsyon reyèl, ou ta rele API a kòm sa:
      // return apiRequest(`/api/admin/categories/${categoryId}`, {
      //   method: "DELETE"
      // });
      
      // Pou tès, n ap senpman retounen yon pwomès rezoud
      return Promise.resolve({ success: true });
    },
    onSuccess: () => {
      toast({
        title: "Siksè!",
        description: "Kategori a efase avèk siksè",
      });
      
      // Fèmen dyalòg la ak ranplase done nan cache
      setCategoryToDelete(null);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/categories'] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erè",
        description: "Te gen yon pwoblèm pandan efasman kategori a",
      });
    }
  });

  // Ouvri dyalòg edisyon ak done kategori a
  const handleEditCategory = (category: Category) => {
    setCategoryToEdit(category);
    editForm.reset({
      name: category.name,
      name_fr: category.name_fr || "",
      name_en: category.name_en || "",
      slug: category.slug,
      description: category.description || "",
      description_fr: category.description_fr || "",
      description_en: category.description_en || ""
    });
    setIsEditDialogOpen(true);
  };

  // Manipile soumisyon fòm ajoute
  const onSubmitAdd = (data: CategoryFormValues) => {
    // Si slug la vid, kreye youn pa otomatik soti nan non an
    if (!data.slug) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
    }
    
    addCategoryMutation.mutate(data);
  };

  // Manipile soumisyon fòm aktyalize
  const onSubmitEdit = (data: CategoryFormValues) => {
    if (categoryToEdit) {
      // Si slug la vid, kreye youn pa otomatik soti nan non an
      if (!data.slug) {
        data.slug = data.name
          .toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .replace(/\s+/g, '-');
      }
      
      updateCategoryMutation.mutate({ id: categoryToEdit.id, values: data });
    }
  };

  // Manipile efasman kategori
  const handleDeleteCategory = async (id: number) => {
    await deleteCategoryMutation.mutate(id);
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Jere Kategori yo</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Ajoute Nouvo Kategori
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Non</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Deskripsyon</TableHead>
                  <TableHead>Tradiksyon</TableHead>
                  <TableHead className="text-right">Aksyon</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.slug}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {category.description || "-"}
                      </TableCell>
                      <TableCell>
                        {category.name_fr && category.name_en ? (
                          <span className="text-green-600">✓ Konplè</span>
                        ) : (
                          <span className="text-amber-600">⚠ Enkonplè</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditCategory(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-600"
                            onClick={() => setCategoryToDelete(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Pa gen kategori anrejistre.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Dyalòg Ajoute Kategori */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ajoute yon Nouvo Kategori</DialogTitle>
            <DialogDescription>
              Kreye yon nouvo kategori pou klasifye atik yo nan sit la.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmitAdd)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Non (Kreyòl)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ekri non kategori a an Kreyòl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name_fr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Non (Fransè)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ekri non kategori a an Fransè" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Non (Anglè)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ekri non kategori a an Anglè" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="egzanp-slug-kategori" 
                        {...field} 
                      />
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
                    <FormLabel>Deskripsyon (Kreyòl, opsyonèl)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Deskripsyon kategori a an Kreyòl" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={addCategoryMutation.isPending}
                  className="w-full"
                >
                  {addCategoryMutation.isPending ? "Ankou..." : "Ajoute Kategori"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dyalòg Edite Kategori */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifye Kategori</DialogTitle>
            <DialogDescription>
              Modifye enfòmasyon sou kategori a.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form className="space-y-4" onSubmit={editForm.handleSubmit(onSubmitEdit)}>
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Non (Kreyòl)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ekri non kategori a an Kreyòl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="name_fr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Non (Fransè)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ekri non kategori a an Fransè" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="name_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Non (Anglè)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ekri non kategori a an Anglè" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="egzanp-slug-kategori" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsyon (Kreyòl, opsyonèl)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Deskripsyon kategori a an Kreyòl" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={updateCategoryMutation.isPending}
                  className="w-full"
                >
                  {updateCategoryMutation.isPending ? "Ankou..." : "Aktyalize Kategori"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dyalòg Konfirmasyon Efase */}
      <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Èske ou sèten ou vle efase kategori sa a?</AlertDialogTitle>
            <AlertDialogDescription>
              Aksyon sa a pa kapab anile. Sa pral efase kategori a ak tout atik ki asosye avèk li.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anile</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => categoryToDelete && handleDeleteCategory(categoryToDelete)}
            >
              Efase
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}