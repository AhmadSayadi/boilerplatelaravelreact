<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    private array $categories = [
        'Elektronik',
        'Fashion',
        'Makanan',
        'Minuman',
        'Kesehatan',
        'Kecantikan',
        'Olahraga',
        'Otomotif',
        'Peralatan Rumah',
        'Buku & Alat Tulis',
    ];

    private array $productsByCategory = [
        'Elektronik' => ['Laptop', 'Smartphone', 'Tablet', 'Headphone', 'Speaker Bluetooth', 'Smartwatch', 'Kamera Digital', 'Power Bank', 'Mouse Wireless', 'Keyboard Mechanical', 'Monitor LED', 'Flash Drive', 'SSD External', 'Router WiFi', 'Webcam HD'],
        'Fashion' => ['Kaos Polos', 'Kemeja Flannel', 'Celana Chino', 'Jaket Denim', 'Sepatu Sneakers', 'Topi Baseball', 'Tas Ransel', 'Dompet Kulit', 'Kacamata Hitam', 'Jam Tangan', 'Sandal Casual', 'Hoodie Premium', 'Celana Jogger', 'Belt Kulit', 'Kaos Kaki'],
        'Makanan' => ['Kopi Arabica', 'Rendang Padang', 'Keripik Singkong', 'Sambal Matah', 'Madu Murni', 'Granola Bar', 'Cokelat Premium', 'Keju Cheddar', 'Sosis Sapi', 'Mie Instan', 'Roti Gandum', 'Selai Kacang', 'Bumbu Dapur Set', 'Snack Mix', 'Kurma Premium'],
        'Minuman' => ['Teh Hijau', 'Jus Buah', 'Air Mineral', 'Kopi Sachet', 'Susu UHT', 'Sirup Buah', 'Minuman Energi', 'Teh Celup', 'Kopi Bubuk', 'Susu Almond', 'Jus Sayur', 'Infused Water', 'Matcha Latte', 'Cokelat Bubuk', 'Soda Kaleng'],
        'Kesehatan' => ['Vitamin C', 'Masker Medis', 'Hand Sanitizer', 'Thermometer Digital', 'Obat Maag', 'Minyak Kayu Putih', 'Plester Luka', 'Suplemen Omega 3', 'Timbangan Digital', 'Tensimeter', 'Multivitamin', 'Probiotik', 'Kolagen Drink', 'Minyak Ikan', 'Obat Batuk'],
        'Kecantikan' => ['Serum Wajah', 'Sunscreen SPF 50', 'Moisturizer', 'Cleanser', 'Toner', 'Sheet Mask', 'Lip Balm', 'Foundation', 'Mascara', 'Eyeshadow Palette', 'Blush On', 'Setting Spray', 'Micellar Water', 'Body Lotion', 'Parfum'],
        'Olahraga' => ['Dumbbell', 'Matras Yoga', 'Resistance Band', 'Skipping Rope', 'Bola Basket', 'Raket Badminton', 'Sepatu Lari', 'Botol Minum Sport', 'Sarung Tangan Gym', 'Foam Roller', 'Kettlebell', 'Pull Up Bar', 'Stopwatch', 'Kacamata Renang', 'Bola Futsal'],
        'Otomotif' => ['Oli Motor', 'Aki Motor', 'Ban Motor', 'Helm Full Face', 'Sarung Jok', 'Wiper Blade', 'Parfum Mobil', 'Dashcam', 'Charger Mobil', 'Kunci Roda', 'Lampu LED Motor', 'Cover Motor', 'Toolkit Set', 'Pompa Ban', 'Shampo Mobil'],
        'Peralatan Rumah' => ['Panci Set', 'Blender', 'Rice Cooker', 'Setrika', 'Vacuum Cleaner', 'Sapu Elektrik', 'Rak Sepatu', 'Gorden', 'Bantal Tidur', 'Handuk Mandi', 'Tempat Sampah', 'Lampu Meja', 'Cermin Dinding', 'Rak Buku', 'Dispenser Air'],
        'Buku & Alat Tulis' => ['Novel Bestseller', 'Buku Motivasi', 'Pulpen Premium', 'Notebook A5', 'Pensil Warna', 'Penghapus Set', 'Penggaris Set', 'Buku Gambar', 'Spidol Warna', 'Sticky Notes', 'Binder Clip', 'Stapler', 'Gunting', 'Lem Kertas', 'Map Dokumen'],
    ];

    public function definition(): array
    {
        $category = fake()->randomElement($this->categories);
        $products = $this->productsByCategory[$category];
        $productName = fake()->randomElement($products);

        $prefix = match ($category) {
            'Elektronik' => 'ELK',
            'Fashion' => 'FSH',
            'Makanan' => 'MKN',
            'Minuman' => 'MNM',
            'Kesehatan' => 'KES',
            'Kecantikan' => 'KEC',
            'Olahraga' => 'OLR',
            'Otomotif' => 'OTM',
            'Peralatan Rumah' => 'PRH',
            'Buku & Alat Tulis' => 'BKT',
            default => 'PRD',
        };

        $sku = $prefix . '-' . strtoupper(fake()->unique()->bothify('??-###'));

        $priceRange = match ($category) {
            'Elektronik' => [500000, 25000000],
            'Fashion' => [50000, 1500000],
            'Makanan' => [10000, 250000],
            'Minuman' => [3000, 100000],
            'Kesehatan' => [15000, 500000],
            'Kecantikan' => [25000, 750000],
            'Olahraga' => [50000, 2000000],
            'Otomotif' => [25000, 5000000],
            'Peralatan Rumah' => [50000, 3000000],
            'Buku & Alat Tulis' => [5000, 200000],
            default => [10000, 1000000],
        };

        return [
            'name' => $productName . ' ' . fake()->optional(0.5)->word(),
            'sku' => $sku,
            'category' => $category,
            'price' => fake()->numberBetween($priceRange[0], $priceRange[1]),
            'stock' => fake()->numberBetween(0, 500),
            'description' => fake()->sentence(10),
            'image' => null,
            'status' => fake()->randomElement(['Active', 'Active', 'Active', 'Inactive']),
        ];
    }
}
