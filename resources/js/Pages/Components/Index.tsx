import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Combobox, MultiCombobox, ComboboxOption } from "@/components/ui/combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useState } from "react";
import { Bell, ChevronDown, Mail, Settings, User } from "lucide-react";
import { Upload } from "@/components/ui/upload";

// Data untuk Combobox
const frameworkOptions: ComboboxOption[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "nextjs", label: "Next.js" },
  { value: "nuxt", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

const countryOptions: ComboboxOption[] = [
  { value: "id", label: "Indonesia", icon: <span>🇮🇩</span> },
  { value: "us", label: "United States", icon: <span>🇺🇸</span> },
  { value: "uk", label: "United Kingdom", icon: <span>🇬🇧</span> },
  { value: "jp", label: "Japan", icon: <span>🇯🇵</span> },
  { value: "kr", label: "South Korea", icon: <span>🇰🇷</span> },
  { value: "sg", label: "Singapore", icon: <span>🇸🇬</span> },
  { value: "my", label: "Malaysia", icon: <span>🇲🇾</span> },
  { value: "au", label: "Australia", icon: <span>🇦🇺</span> },
];

const userOptions: ComboboxOption[] = [
  { 
    value: "john", 
    label: "John Doe", 
    description: "john@example.com",
    icon: (
      <Avatar className="h-5 w-5">
        <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" />
        <AvatarFallback className="text-[10px]">JD</AvatarFallback>
      </Avatar>
    )
  },
  { 
    value: "jane", 
    label: "Jane Smith", 
    description: "jane@example.com",
    icon: (
      <Avatar className="h-5 w-5">
        <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" />
        <AvatarFallback className="text-[10px]">JS</AvatarFallback>
      </Avatar>
    )
  },
  { 
    value: "bob", 
    label: "Bob Wilson", 
    description: "bob@example.com",
    icon: (
      <Avatar className="h-5 w-5">
        <AvatarFallback className="text-[10px]">BW</AvatarFallback>
      </Avatar>
    )
  },
  { 
    value: "alice", 
    label: "Alice Brown", 
    description: "alice@example.com",
    icon: (
      <Avatar className="h-5 w-5">
        <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" />
        <AvatarFallback className="text-[10px]">AB</AvatarFallback>
      </Avatar>
    )
  },
];

export default function Components() {
  const [progress, setProgress] = useState(60);
  const [sliderValue, setSliderValue] = useState([50]);
  
  // Combobox states
  const [framework, setFramework] = useState("");
  const [country, setCountry] = useState("");
  const [user, setUser] = useState("");
  const [multiFrameworks, setMultiFrameworks] = useState<string[]>([]);
  
  // Upload states
  const [singleFile, setSingleFile] = useState<File | null>(null);
  const [multipleFiles, setMultipleFiles] = useState<File[] | null>(null);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">UI Components</h1>
          <p className="text-muted-foreground">Komponen UI yang tersedia dalam sistem</p>
        </div>

        {/* Searchable Dropdown Section */}
        <Card>
          <CardHeader>
            <CardTitle>Searchable Dropdown (Combobox)</CardTitle>
            <CardDescription>
              Komponen reusable dari <code className="text-xs bg-muted px-1 py-0.5 rounded">@/components/ui/combobox</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Combobox */}
              <div className="space-y-2">
                <Label>Framework (Basic)</Label>
                <Combobox
                  options={frameworkOptions}
                  value={framework}
                  onValueChange={setFramework}
                  placeholder="Pilih framework..."
                  searchPlaceholder="Cari framework..."
                  emptyText="Framework tidak ditemukan."
                />
                {framework && (
                  <p className="text-sm text-muted-foreground">
                    Dipilih: <span className="font-medium text-foreground">
                      {frameworkOptions.find(f => f.value === framework)?.label}
                    </span>
                  </p>
                )}
              </div>

              {/* Combobox with Icons */}
              <div className="space-y-2">
                <Label>Negara (With Icons)</Label>
                <Combobox
                  options={countryOptions}
                  value={country}
                  onValueChange={setCountry}
                  placeholder="Pilih negara..."
                  searchPlaceholder="Cari negara..."
                  emptyText="Negara tidak ditemukan."
                />
              </div>

              {/* Combobox with Avatar & Description */}
              <div className="space-y-2">
                <Label>User (With Avatar)</Label>
                <Combobox
                  options={userOptions}
                  value={user}
                  onValueChange={setUser}
                  placeholder="Pilih user..."
                  searchPlaceholder="Cari user..."
                  emptyText="User tidak ditemukan."
                />
              </div>

              {/* Multi-Select Combobox */}
              <div className="space-y-2">
                <Label>Framework (Multi-Select)</Label>
                <MultiCombobox
                  options={frameworkOptions}
                  values={multiFrameworks}
                  onValuesChange={setMultiFrameworks}
                  placeholder="Pilih framework..."
                  searchPlaceholder="Cari framework..."
                  emptyText="Framework tidak ditemukan."
                  maxDisplay={2}
                />
                {multiFrameworks.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {multiFrameworks.length} item dipilih
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {/* Usage Example Code */}
            <div className="space-y-2">
              <Label>Contoh Penggunaan:</Label>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`import { Combobox, MultiCombobox } from "@/components/ui/combobox";

// Single Select
<Combobox
  options={[
    { value: "react", label: "React" },
    { value: "vue", label: "Vue.js", icon: <VueIcon /> },
    { value: "angular", label: "Angular", description: "By Google" },
  ]}
  value={value}
  onValueChange={setValue}
  placeholder="Select framework..."
/>

// Multi Select
<MultiCombobox
  options={options}
  values={values}
  onValuesChange={setValues}
  maxDisplay={3}
/>`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Buttons Section */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>Berbagai variasi tombol yang tersedia</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon"><Bell className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button disabled>Disabled</Button>
              <Button className="gap-2"><Mail className="h-4 w-4" /> With Icon</Button>
            </div>
          </CardContent>
        </Card>

        {/* Badges Section */}
        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>Label dan status indicator</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge className="bg-success/10 text-success">Success</Badge>
              <Badge className="bg-warning/10 text-warning">Warning</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Form Elements */}
        <Card>
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
            <CardDescription>Input, select, checkbox, dan elemen form lainnya</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="input-demo">Text Input</Label>
                <Input id="input-demo" placeholder="Masukkan teks..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-demo">Email Input</Label>
                <Input id="email-demo" type="email" placeholder="email@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Select</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih opsi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                    <SelectItem value="option3">Option 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-demo">Password Input</Label>
                <Input id="password-demo" type="password" placeholder="••••••••" />
              </div>
            </div>
            
            <Separator />
            
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms">Accept terms</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="airplane-mode" />
                <Label htmlFor="airplane-mode">Airplane Mode</Label>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Progress: {progress}%</Label>
                <Progress value={progress} />
              </div>
              <div className="space-y-2">
                <Label>Slider: {sliderValue[0]}</Label>
                <Slider value={sliderValue} onValueChange={setSliderValue} max={100} step={1} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Tabs</CardTitle>
            <CardDescription>Navigasi tab untuk konten berbeda</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="account" className="w-full">
              <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="account" className="p-4 border rounded-lg mt-2">
                <p className="text-sm text-muted-foreground">
                  Kelola pengaturan akun Anda di sini.
                </p>
              </TabsContent>
              <TabsContent value="password" className="p-4 border rounded-lg mt-2">
                <p className="text-sm text-muted-foreground">
                  Ubah password Anda di sini.
                </p>
              </TabsContent>
              <TabsContent value="settings" className="p-4 border rounded-lg mt-2">
                <p className="text-sm text-muted-foreground">
                  Pengaturan aplikasi lainnya.
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Avatars */}
        <Card>
          <CardHeader>
            <CardTitle>Avatars</CardTitle>
            <CardDescription>Menampilkan foto profil pengguna</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" />
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <Avatar className="h-12 w-12">
                <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" />
                <AvatarFallback>EM</AvatarFallback>
              </Avatar>
              <Avatar className="h-14 w-14">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">AB</AvatarFallback>
              </Avatar>
            </div>
          </CardContent>
        </Card>

        {/* Dialogs & Dropdowns */}
        <Card>
          <CardHeader>
            <CardTitle>Dialogs & Dropdowns</CardTitle>
            <CardDescription>Modal dialog dan dropdown menu</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog Title</DialogTitle>
                  <DialogDescription>
                    Ini adalah contoh dialog. Anda dapat menambahkan konten apapun di sini.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-muted-foreground">Konten dialog...</p>
                </div>
                <DialogFooter>
                  <Button variant="outline">Batal</Button>
                  <Button>Simpan</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Item</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tindakan ini tidak dapat dibatalkan. Data akan dihapus secara permanen.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Dropdown <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-popover">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><User className="h-4 w-4 mr-2" /> Profile</DropdownMenuItem>
                <DropdownMenuItem><Settings className="h-4 w-4 mr-2" /> Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>

        {/* Toast Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Toast Notifications</CardTitle>
            <CardDescription>Notifikasi popup untuk feedback pengguna</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={() => toast.success("Berhasil menyimpan data!")}>
              Success Toast
            </Button>
            <Button variant="destructive" onClick={() => toast.error("Terjadi kesalahan!")}>
              Error Toast
            </Button>
            <Button variant="outline" onClick={() => toast.info("Informasi penting")}>
              Info Toast
            </Button>
            <Button variant="secondary" onClick={() => toast.warning("Peringatan!")}>
              Warning Toast
            </Button>
          </CardContent>
        </Card>

        {/* Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Upload</CardTitle>
            <CardDescription>
              Komponen upload dari <code className="text-xs bg-muted px-1 py-0.5 rounded">@/components/ui/upload</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Interactive Examples */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Interactive Examples</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Single File Upload */}
                <div className="space-y-2">
                  <Label>Single File Upload</Label>
                  <Upload
                    value={singleFile}
                    onChange={(file) => setSingleFile(file as File | null)}
                    accept="image/*"
                    maxSize={5}
                    placeholder="Klik atau drag gambar ke sini"
                  />
                </div>

                {/* Multiple Files Upload */}
                <div className="space-y-2">
                  <Label>Multiple Files Upload</Label>
                  <Upload
                    value={multipleFiles}
                    onChange={(files) => setMultipleFiles(files as File[] | null)}
                    accept="image/*,.pdf,.doc,.docx"
                    multiple
                    maxSize={10}
                    placeholder="Klik atau drag file ke sini (multiple)"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* State Examples */}
            <div>
              <Label className="text-base font-semibold mb-3 block">State Examples</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Default State */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Default State</Label>
                  <div className="relative border-2 border-dashed rounded-lg p-6 border-muted-foreground/25 flex flex-col items-center justify-center gap-2 text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Klik atau drag file ke sini</p>
                      <p className="text-xs text-muted-foreground mt-1">Maks 5MB • image/*</p>
                    </div>
                  </div>
                </div>

                {/* Hover/Drag State */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Hover/Drag State</Label>
                  <div className="relative border-2 border-dashed rounded-lg p-6 border-primary bg-primary/5 flex flex-col items-center justify-center gap-2 text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Lepaskan file di sini</p>
                      <p className="text-xs text-muted-foreground mt-1">Maks 5MB • image/*</p>
                    </div>
                  </div>
                </div>

                {/* Disabled State */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Disabled State</Label>
                  <div className="relative border-2 border-dashed rounded-lg p-6 border-muted-foreground/25 flex flex-col items-center justify-center gap-2 text-center opacity-50 cursor-not-allowed">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Upload disabled</p>
                      <p className="text-xs text-muted-foreground mt-1">Maks 5MB • image/*</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* File Preview Example */}
            <div>
              <Label className="text-base font-semibold mb-3 block">File Preview Example</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">2 file dipilih</span>
                  <Button type="button" variant="ghost" size="sm" className="text-destructive hover:text-destructive h-7 px-2">
                    Hapus Semua
                  </Button>
                </div>
                <div className="grid gap-2">
                  {/* Image File Preview */}
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
                      alt="Preview"
                      className="h-10 w-10 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">profile-photo.jpg</p>
                      <p className="text-xs text-muted-foreground">1.2 MB</p>
                    </div>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </Button>
                  </div>
                  {/* Document File Preview */}
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                    <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">document.pdf</p>
                      <p className="text-xs text-muted-foreground">524 KB</p>
                    </div>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Usage Example Code */}
            <div className="space-y-2">
              <Label>Contoh Penggunaan:</Label>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`import { Upload } from "@/components/ui/upload";

// Single File
<Upload
  value={file}
  onChange={setFile}
  accept="image/*"
  maxSize={5} // in MB
  placeholder="Klik atau drag file..."
/>

// Multiple Files
<Upload
  value={files}
  onChange={setFiles}
  accept="image/*,.pdf"
  multiple
  maxSize={10}
/>`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Cards</CardTitle>
            <CardDescription>Contoh variasi card layout</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Basic Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Ini adalah contoh card sederhana.</p>
                </CardContent>
              </Card>
              <Card className="border-primary">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-primary">Highlighted Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Card dengan border highlight.</p>
                </CardContent>
              </Card>
              <Card className="bg-muted">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Muted Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Card dengan background muted.</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
