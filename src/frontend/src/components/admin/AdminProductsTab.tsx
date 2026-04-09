import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Edit2,
  ImageIcon,
  Package,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  useAdminAddProduct,
  useAdminDeleteProduct,
  useAdminGetProducts,
  useAdminUpdateProduct,
} from "../../hooks/useBackend";
import { uploadImageToStorage } from "../../lib/storageUpload";
import type { Product } from "../../types";

interface ProductFormData {
  name: string;
  price: string;
  imageUrl: string; // persisted/existing URL
  pendingFile: File | null; // new file selected but not yet uploaded
  previewUrl: string; // local object URL or existing imageUrl for preview
}

const EMPTY_FORM: ProductFormData = {
  name: "",
  price: "",
  imageUrl: "",
  pendingFile: null,
  previewUrl: "",
};

export default function AdminProductsTab() {
  const { data: products, isLoading } = useAdminGetProducts();
  const { mutateAsync: addProduct, isPending: adding } = useAdminAddProduct();
  const { mutateAsync: updateProduct, isPending: updating } =
    useAdminUpdateProduct();
  const { mutateAsync: deleteProduct, isPending: deleting } =
    useAdminDeleteProduct();

  const [addOpen, setAddOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormData>(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setUploadProgress(0);
    setAddOpen(true);
  };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name,
      price: String(p.price),
      imageUrl: p.imageUrl ?? "",
      pendingFile: null,
      previewUrl: p.imageUrl ?? "",
    });
    setUploadProgress(0);
    setEditProduct(p);
  };

  /** Resolve final imageUrl: upload pending file if any, else use existing URL */
  async function resolveImageUrl(): Promise<string | null> {
    if (form.pendingFile) {
      setUploading(true);
      setUploadProgress(0);
      try {
        const url = await uploadImageToStorage(form.pendingFile, (pct) => {
          setUploadProgress(pct);
        });
        return url;
      } finally {
        setUploading(false);
      }
    }
    return form.imageUrl.trim() || null;
  }

  const handleAdd = async () => {
    if (!form.name.trim() || !form.price.trim()) {
      toast.error("Name and price are required");
      return;
    }
    if (!form.pendingFile && !form.imageUrl) {
      toast.error("Product image is required");
      return;
    }
    try {
      const imageUrl = await resolveImageUrl();
      await addProduct({
        name: form.name.trim(),
        price: BigInt(Math.round(Number(form.price))),
        imageUrl,
      });
      toast.success("Product added successfully");
      setAddOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add product");
    }
  };

  const handleUpdate = async () => {
    if (!editProduct || !form.name.trim() || !form.price.trim()) {
      toast.error("Name and price are required");
      return;
    }
    if (!form.pendingFile && !form.imageUrl) {
      toast.error("Product image is required");
      return;
    }
    try {
      const imageUrl = await resolveImageUrl();
      await updateProduct({
        id: editProduct.id,
        name: form.name.trim(),
        price: BigInt(Math.round(Number(form.price))),
        imageUrl,
      });
      toast.success("Product updated successfully");
      setEditProduct(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update product",
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteProduct(deleteConfirm.id);
      toast.success("Product deleted");
      setDeleteConfirm(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete product",
      );
    }
  };

  const isSubmitting = uploading || adding || updating;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-display font-semibold text-foreground">
            Products
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage your product catalog
          </p>
        </div>
        <Button
          size="sm"
          onClick={openAdd}
          className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          data-ocid="admin-add-product"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Product
        </Button>
      </div>

      <Card className="bg-card border border-border">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="divide-y divide-border/50">
              {products.map((p) => (
                <div
                  key={String(p.id)}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-muted/20 transition-colors"
                  data-ocid={`admin-product-${p.id}`}
                >
                  {/* Image thumbnail */}
                  <div className="w-12 h-12 rounded-lg bg-muted border border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                    ) : (
                      <Package className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {p.name}
                    </p>
                    <p className="text-sm text-primary font-semibold">
                      ₹{Number(p.price).toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* Status */}
                  <Badge
                    className={
                      p.isActive
                        ? "bg-primary/10 text-primary border-primary/20 text-xs"
                        : "bg-muted text-muted-foreground border-border text-xs"
                    }
                  >
                    {p.isActive ? "Active" : "Inactive"}
                  </Badge>

                  {/* Actions */}
                  <div className="flex gap-1.5 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                      onClick={() => openEdit(p)}
                      data-ocid={`admin-edit-product-${p.id}`}
                      aria-label="Edit product"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleteConfirm(p)}
                      data-ocid={`admin-delete-product-${p.id}`}
                      aria-label="Delete product"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <Package className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">
                No products yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Add your first product to get started
              </p>
              <Button
                size="sm"
                onClick={openAdd}
                className="mt-4 gap-1.5 bg-primary text-primary-foreground"
                data-ocid="admin-add-product-empty"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Product
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-foreground">
              Add New Product
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            form={form}
            onChange={setForm}
            uploadProgress={uploading ? uploadProgress : undefined}
          />
          <div className="flex gap-2 justify-end pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddOpen(false)}
              className="border-border"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-ocid="admin-save-product"
            >
              {uploading
                ? `Uploading… ${uploadProgress}%`
                : adding
                  ? "Adding…"
                  : "Add Product"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog
        open={!!editProduct}
        onOpenChange={(o) => !o && setEditProduct(null)}
      >
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-foreground">
              Edit Product
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            form={form}
            onChange={setForm}
            uploadProgress={uploading ? uploadProgress : undefined}
          />
          <div className="flex gap-2 justify-end pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditProduct(null)}
              className="border-border"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleUpdate}
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-ocid="admin-update-product"
            >
              {uploading
                ? `Uploading… ${uploadProgress}%`
                : updating
                  ? "Saving…"
                  : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={(o) => !o && setDeleteConfirm(null)}
      >
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-foreground">
              Delete Product?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Are you sure you want to delete{" "}
            <strong className="text-foreground">{deleteConfirm?.name}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex gap-2 justify-end pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteConfirm(null)}
              className="border-border"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
              data-ocid="admin-confirm-delete"
            >
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProductForm({
  form,
  onChange,
  uploadProgress,
}: {
  form: ProductFormData;
  onChange: (f: ProductFormData) => void;
  uploadProgress?: number;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed (JPG, PNG, WebP)");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    // Revoke previous local object URL to avoid memory leaks
    if (form.previewUrl && form.pendingFile) {
      URL.revokeObjectURL(form.previewUrl);
    }
    // Use a local blob URL only for preview — the actual Firebase download URL
    // is obtained via uploadBytes() when the form is submitted.
    const localUrl = URL.createObjectURL(file);
    onChange({ ...form, pendingFile: file, previewUrl: localUrl });
  };

  const handleClearImage = () => {
    if (form.previewUrl && form.pendingFile) {
      URL.revokeObjectURL(form.previewUrl);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
    onChange({ ...form, pendingFile: null, previewUrl: "", imageUrl: "" });
  };

  const hasPreview = !!form.previewUrl;

  return (
    <div className="space-y-4 py-2">
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Product Name</Label>
        <Input
          value={form.name}
          onChange={(e) => onChange({ ...form, name: e.target.value })}
          placeholder="e.g. GUCCORA Premium Kit"
          className="bg-background border-input"
          data-ocid="admin-product-name"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Price (₹)</Label>
        <Input
          type="number"
          value={form.price}
          onChange={(e) => onChange({ ...form, price: e.target.value })}
          placeholder="e.g. 999"
          min="0"
          className="bg-background border-input"
          data-ocid="admin-product-price"
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">
          Product Image <span className="text-destructive">*</span>
        </Label>

        {/* Preview */}
        {hasPreview && (
          <div className="relative w-full rounded-lg overflow-hidden border border-border bg-muted">
            <img
              src={form.previewUrl}
              alt="Preview"
              className="w-full h-40 object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-7 w-7 p-0 bg-card/80 hover:bg-card text-muted-foreground hover:text-destructive rounded-full"
              onClick={handleClearImage}
              aria-label="Remove image"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
            {uploadProgress !== undefined && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        )}

        {/* File input trigger */}
        {!hasPreview && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-32 rounded-lg border-2 border-dashed border-border bg-background hover:border-primary/50 hover:bg-muted/30 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer"
            data-ocid="admin-product-image"
          >
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-foreground flex items-center gap-1 justify-center">
                <Upload className="h-3 w-3" />
                Upload Image
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                JPG, PNG, WebP up to 5MB
              </p>
            </div>
          </button>
        )}

        {/* Hidden actual file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          data-ocid="admin-product-file-input"
        />

        {/* Replace button when image is selected */}
        {hasPreview && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full gap-1.5 border-border text-muted-foreground"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-3.5 w-3.5" />
            Replace Image
          </Button>
        )}
      </div>
    </div>
  );
}
