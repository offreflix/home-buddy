import { PrismaClient, Unit, MovementType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  const user = await prisma.user.findFirst();
  if (!user) {
    throw new Error('Usuário não encontrado. Crie um usuário primeiro.');
  }

  console.log(`👤 Usando usuário: ${user.username}`);

  const categories = [
    { name: 'Limpeza' },
    { name: 'Higiene Pessoal' },
    { name: 'Alimentos' },
    { name: 'Bebidas' },
    { name: 'Papelaria' },
    { name: 'Eletrônicos' },
    { name: 'Cozinha' },
    { name: 'Banheiro' },
    { name: 'Lavanderia' },
    { name: 'Manutenção' },
  ];

  console.log('📂 Criando categorias...');
  const createdCategories = [];
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
    createdCategories.push(created);
    console.log(`✅ Categoria criada: ${created.name}`);
  }

  const limpezaProducts = [
    {
      name: 'Detergente Líquido',
      description: 'Detergente para louças',
      unit: Unit.L,
      desiredQuantity: 2,
      currentQuantity: 1.5,
    },
    {
      name: 'Desinfetante',
      description: 'Desinfetante multiuso',
      unit: Unit.L,
      desiredQuantity: 1,
      currentQuantity: 0.8,
    },
    {
      name: 'Limpador Multiuso',
      description: 'Limpador para superfícies',
      unit: Unit.L,
      desiredQuantity: 1,
      currentQuantity: 0.3,
    },
    {
      name: 'Papel Toalha',
      description: 'Rolo de papel toalha',
      unit: Unit.unidade,
      desiredQuantity: 6,
      currentQuantity: 2,
    },
    {
      name: 'Esponja de Aço',
      description: 'Esponja para limpeza pesada',
      unit: Unit.unidade,
      desiredQuantity: 4,
      currentQuantity: 1,
    },
  ];

  const higieneProducts = [
    {
      name: 'Shampoo',
      description: 'Shampoo para cabelos normais',
      unit: Unit.L,
      desiredQuantity: 1,
      currentQuantity: 0.7,
    },
    {
      name: 'Sabonete',
      description: 'Sabonete em barra',
      unit: Unit.unidade,
      desiredQuantity: 4,
      currentQuantity: 2,
    },
    {
      name: 'Pasta de Dente',
      description: 'Pasta dental com flúor',
      unit: Unit.unidade,
      desiredQuantity: 2,
      currentQuantity: 1,
    },
    {
      name: 'Papel Higiênico',
      description: 'Rolo de papel higiênico',
      unit: Unit.unidade,
      desiredQuantity: 12,
      currentQuantity: 8,
    },
    {
      name: 'Desodorante',
      description: 'Desodorante roll-on',
      unit: Unit.unidade,
      desiredQuantity: 2,
      currentQuantity: 1,
    },
  ];

  const alimentosProducts = [
    {
      name: 'Arroz',
      description: 'Arroz branco tipo 1',
      unit: Unit.kg,
      desiredQuantity: 5,
      currentQuantity: 2.5,
    },
    {
      name: 'Feijão',
      description: 'Feijão carioca',
      unit: Unit.kg,
      desiredQuantity: 2,
      currentQuantity: 1.2,
    },
    {
      name: 'Macarrão',
      description: 'Macarrão espaguete',
      unit: Unit.kg,
      desiredQuantity: 3,
      currentQuantity: 1.8,
    },
    {
      name: 'Óleo de Soja',
      description: 'Óleo de soja refinado',
      unit: Unit.L,
      desiredQuantity: 2,
      currentQuantity: 1.5,
    },
    {
      name: 'Sal',
      description: 'Sal refinado iodado',
      unit: Unit.kg,
      desiredQuantity: 1,
      currentQuantity: 0.8,
    },
  ];

  const bebidasProducts = [
    {
      name: 'Café em Pó',
      description: 'Café solúvel',
      unit: Unit.kg,
      desiredQuantity: 1,
      currentQuantity: 0.6,
    },
    {
      name: 'Chá Verde',
      description: 'Sachês de chá verde',
      unit: Unit.unidade,
      desiredQuantity: 20,
      currentQuantity: 15,
    },
    {
      name: 'Suco de Laranja',
      description: 'Suco natural',
      unit: Unit.L,
      desiredQuantity: 2,
      currentQuantity: 0.5,
    },
    {
      name: 'Água Mineral',
      description: 'Garrafas de água',
      unit: Unit.unidade,
      desiredQuantity: 12,
      currentQuantity: 8,
    },
  ];

  const papelariaProducts = [
    {
      name: 'Caderno',
      description: 'Caderno universitário',
      unit: Unit.unidade,
      desiredQuantity: 3,
      currentQuantity: 1,
    },
    {
      name: 'Caneta',
      description: 'Caneta esferográfica azul',
      unit: Unit.unidade,
      desiredQuantity: 10,
      currentQuantity: 6,
    },
    {
      name: 'Lápis',
      description: 'Lápis grafite HB',
      unit: Unit.unidade,
      desiredQuantity: 8,
      currentQuantity: 4,
    },
    {
      name: 'Borracha',
      description: 'Borracha escolar',
      unit: Unit.unidade,
      desiredQuantity: 5,
      currentQuantity: 2,
    },
  ];

  const cozinhaProducts = [
    {
      name: 'Papel Alumínio',
      description: 'Rolo de papel alumínio',
      unit: Unit.unidade,
      desiredQuantity: 2,
      currentQuantity: 1,
    },
    {
      name: 'Filme Plástico',
      description: 'Rolo de filme plástico',
      unit: Unit.unidade,
      desiredQuantity: 2,
      currentQuantity: 0.5,
    },
    {
      name: 'Sacos de Lixo',
      description: 'Sacos para lixo doméstico',
      unit: Unit.unidade,
      desiredQuantity: 30,
      currentQuantity: 15,
    },
    {
      name: 'Guardanapo',
      description: 'Guardanapos de papel',
      unit: Unit.unidade,
      desiredQuantity: 100,
      currentQuantity: 60,
    },
  ];

  const banheiroProducts = [
    {
      name: 'Sabonete Líquido',
      description: 'Sabonete líquido para mãos',
      unit: Unit.L,
      desiredQuantity: 1,
      currentQuantity: 0.4,
    },
    {
      name: 'Escova de Dentes',
      description: 'Escova dental macia',
      unit: Unit.unidade,
      desiredQuantity: 4,
      currentQuantity: 2,
    },
    {
      name: 'Fio Dental',
      description: 'Rolo de fio dental',
      unit: Unit.unidade,
      desiredQuantity: 3,
      currentQuantity: 1,
    },
    {
      name: 'Lenços Umedecidos',
      description: 'Pacote de lenços',
      unit: Unit.unidade,
      desiredQuantity: 2,
      currentQuantity: 1,
    },
  ];

  const lavanderiaProducts = [
    {
      name: 'Sabão em Pó',
      description: 'Sabão para roupas',
      unit: Unit.kg,
      desiredQuantity: 2,
      currentQuantity: 1.2,
    },
    {
      name: 'Amaciante',
      description: 'Amaciante de roupas',
      unit: Unit.L,
      desiredQuantity: 2,
      currentQuantity: 1.5,
    },
    {
      name: 'Água Sanitária',
      description: 'Água sanitária concentrada',
      unit: Unit.L,
      desiredQuantity: 1,
      currentQuantity: 0.8,
    },
    {
      name: 'Sabão de Coco',
      description: 'Sabão em barra para roupas',
      unit: Unit.unidade,
      desiredQuantity: 6,
      currentQuantity: 3,
    },
  ];

  const manutencaoProducts = [
    {
      name: 'Fita Isolante',
      description: 'Fita isolante elétrica',
      unit: Unit.unidade,
      desiredQuantity: 2,
      currentQuantity: 1,
    },
    {
      name: 'Parafusos',
      description: 'Caixa de parafusos diversos',
      unit: Unit.unidade,
      desiredQuantity: 1,
      currentQuantity: 1,
    },
    {
      name: 'Pregos',
      description: 'Caixa de pregos diversos',
      unit: Unit.unidade,
      desiredQuantity: 1,
      currentQuantity: 1,
    },
    {
      name: 'Cola Super Bonder',
      description: 'Cola instantânea',
      unit: Unit.unidade,
      desiredQuantity: 2,
      currentQuantity: 1,
    },
  ];

  const allProducts = [
    { categoryName: 'Limpeza', products: limpezaProducts },
    { categoryName: 'Higiene Pessoal', products: higieneProducts },
    { categoryName: 'Alimentos', products: alimentosProducts },
    { categoryName: 'Bebidas', products: bebidasProducts },
    { categoryName: 'Papelaria', products: papelariaProducts },
    { categoryName: 'Cozinha', products: cozinhaProducts },
    { categoryName: 'Banheiro', products: banheiroProducts },
    { categoryName: 'Lavanderia', products: lavanderiaProducts },
    { categoryName: 'Manutenção', products: manutencaoProducts },
  ];

  console.log('📦 Criando produtos...');
  let totalProducts = 0;

  for (const categoryGroup of allProducts) {
    const category = createdCategories.find(
      (c) => c.name === categoryGroup.categoryName,
    );
    if (!category) continue;

    for (const productData of categoryGroup.products) {
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          unit: productData.unit,
          categoryId: category.id,
          userId: user.id,
        },
      });

      await prisma.stock.create({
        data: {
          productId: product.id,
          currentQuantity: productData.currentQuantity,
          desiredQuantity: productData.desiredQuantity,
        },
      });

      await prisma.stockMovement.create({
        data: {
          productId: product.id,
          movementType: MovementType.IN,
          quantity: productData.currentQuantity,
          description: 'Estoque inicial',
        },
      });

      totalProducts++;
      console.log(
        `✅ Produto criado: ${product.name} (${productData.currentQuantity} ${productData.unit})`,
      );
    }
  }

  console.log(`🎉 Seed concluído!`);
  console.log(`📊 Resumo:`);
  console.log(`   - Categorias: ${createdCategories.length}`);
  console.log(`   - Produtos: ${totalProducts}`);
  console.log(`   - Usuário: ${user.username}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
