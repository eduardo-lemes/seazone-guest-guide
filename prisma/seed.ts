import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Reset experience guides so seed data always wins over AI-generated cache
  await prisma.experienceGuide.deleteMany({
    where: { propertyCode: { in: ["FLN001", "GRM001", "POA001", "RIO001", "CWB001"] } },
  });

  await prisma.property.upsert({
    where: { code: "FLN001" },
    update: {},
    create: {
      code: "FLN001",
      name: "Apartamento Beira-Mar Florianópolis",
      propertyType: "Apartamento",
      bedroomQuantity: 2,
      bathroomQuantity: 1,
      guestCapacity: 4,
      address: {
        street: "Rua Lauro Linhares",
        number: "589",
        complement: "Apto 301",
        neighborhood: "Trindade",
        city: "Florianópolis",
        state: "SC",
        postalCode: "88036-001",
      },
      operational: {
        wifiNetwork: "SeaHome_FLN001",
        wifiPassword: "floripa2024",
        isSelfCheckin: true,
        propertyAccessType: "smart_lock",
        propertyAccessInstructions: "Use o código 4521 na fechadura eletrônica",
        propertyPassword: "4521",
        hasParkingSpot: true,
        parkingSpotIdentifier: "Vaga 12 - subsolo B1",
        parkingSpotInstructions: "Portão lateral, código 7890 no interfone",
      },
      rules: {
        checkInTime: "15:00",
        checkOutTime: "11:00",
        allowPet: false,
        smokingPermitted: false,
        suitableForChildren: true,
        suitableForBabies: true,
        eventsPermitted: false,
      },
      amenities: {
        wifi: true,
        tv: true,
        airConditioning: true,
        kitchen: true,
        washingMachine: true,
        elevator: true,
        balcony: true,
      },
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      ],
      hostName: "Ana Paula",
      hostPhone: "+5548991234567",
    },
  });

  await prisma.property.upsert({
    where: { code: "GRM001" },
    update: {},
    create: {
      code: "GRM001",
      name: "Chalé Serra Gramado",
      propertyType: "Casa",
      bedroomQuantity: 3,
      bathroomQuantity: 2,
      guestCapacity: 6,
      address: {
        street: "Rua das Hortênsias",
        number: "220",
        complement: null,
        neighborhood: "Planalto",
        city: "Gramado",
        state: "RS",
        postalCode: "95670-000",
      },
      operational: {
        wifiNetwork: "ChaletSerra_GRM",
        wifiPassword: "gramado@2024",
        isSelfCheckin: false,
        propertyAccessType: "keybox",
        propertyAccessInstructions:
          "A chave está no cofre na entrada. Código: 1983",
        propertyPassword: "1983",
        hasParkingSpot: true,
        parkingSpotInstructions: "Garagem própria para 2 carros",
      },
      rules: {
        checkInTime: "14:00",
        checkOutTime: "12:00",
        allowPet: true,
        smokingPermitted: false,
        suitableForChildren: true,
        suitableForBabies: false,
        eventsPermitted: false,
      },
      amenities: {
        wifi: true,
        tv: true,
        kitchen: true,
        bbqGrill: true,
        balcony: true,
        dishwasher: true,
      },
      images: [
        "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800",
      ],
      hostName: "Carlos Eduardo",
      hostPhone: "+5554998765432",
    },
  });

  await prisma.experienceGuide.upsert({
    where: { propertyCode: "FLN001" },
    update: {},
    create: {
      propertyCode: "FLN001",
      content: {
        welcomeMessage:
          "Seu apartamento fica no coração da Trindade, a poucos minutos das principais atrações da ilha. Aproveite a localização privilegiada para explorar praias, restaurantes e a vibrante vida cultural de Florianópolis.",
        restaurants: [
          {
            name: "Box 32",
            distance: "Aprox. 1,2 km",
            description:
              "Boteco tradicional de Florianópolis, famoso pelos petiscos e pelo ambiente descontraído.",
          },
          {
            name: "Armazém Vieira",
            distance: "Aprox. 2,5 km",
            description: "Referência em frutos do mar desde 1958, ícone da gastronomia catarinense.",
          },
          {
            name: "Rancho Açoriano",
            distance: "Aprox. 1,8 km",
            description:
              "Culinária açoriana autêntica com destaque para camarão, tainha e ostras da ilha.",
          },
          {
            name: "Restaurante Ponto G",
            distance: "Aprox. 900 m",
            description:
              "Ambiente descontraído com boa variedade de pratos executivos e opções vegetarianas.",
          },
        ],
        attractions: [
          {
            name: "Lagoa da Conceição",
            distance: "Aprox. 12 km",
            description:
              "Lagoa de água salgada cercada de dunas, trilhas e restaurantes à beira da água.",
          },
          {
            name: "Praia da Joaquina",
            distance: "Aprox. 18 km",
            description: "Famosa pelas dunas e pelas ondas ideais para o surf.",
          },
          {
            name: "Centro Histórico de Florianópolis",
            distance: "Aprox. 4 km",
            description:
              "Mercado Público, Catedral, Palácio Cruz e Sousa - o coração histórico e cultural da cidade.",
          },
        ],
        essentials: [
          {
            name: "Farmácia Catarinense",
            type: "pharmacy",
            distance: "Aprox. 300 m",
            description: "Farmácia 24h na Av. Madre Benvenuta.",
          },
          {
            name: "Supermercado Nacional",
            type: "supermarket",
            distance: "Aprox. 700 m",
            description: "Supermercado completo com hortifrúti e padaria.",
          },
          {
            name: "Hospital Universitário - HU/UFSC",
            type: "hospital",
            distance: "Aprox. 1,5 km",
            description: "Hospital universitário de referência, atendimento 24h.",
          },
        ],
        seasonalTip:
          "Em junho, as temperaturas ficam entre 14°C e 20°C. Leve um agasalho para as noites frescas e aproveite a baixa temporada com praias mais tranquilas.",
      },
    },
  });

  await prisma.experienceGuide.upsert({
    where: { propertyCode: "GRM001" },
    update: {},
    create: {
      propertyCode: "GRM001",
      content: {
        welcomeMessage:
          "Bem-vindo ao Chalé Serra Gramado! Você está no coração da cidade mais encantadora da Serra Gaúcha. Explore a arquitetura europeia, a gastronomia premiada e os parques naturais deslumbrantes ao redor.",
        restaurants: [
          {
            name: "Bella Italia",
            distance: "Aprox. 1,5 km",
            description:
              "Restaurante italiano clássico, referência em massas artesanais e risotos na Serra Gaúcha.",
          },
          {
            name: "Gasthof Edelweiss",
            distance: "Aprox. 2 km",
            description:
              "Culinária alemã e colonial gaúcha, famoso pelo café colonial com cucas, geleias e embutidos.",
          },
          {
            name: "Restaurante Saint Andrews",
            distance: "Aprox. 1,8 km",
            description:
              "Ambiente sofisticado com destaque para fondues de queijo e chocolate, ideal para o frio da serra.",
          },
          {
            name: "Colina Verde Restaurante",
            distance: "Aprox. 1,2 km",
            description:
              "Vista panorâmica da cidade e cardápio variado com pratos regionais e internacionais.",
          },
        ],
        attractions: [
          {
            name: "Lago Negro",
            distance: "Aprox. 2 km",
            description:
              "Cartão-postal de Gramado com pedalinhos, jardins floridos e paisagem europeia.",
          },
          {
            name: "Mini Mundo",
            distance: "Aprox. 2,5 km",
            description:
              "Parque com maquetes em escala de monumentos mundiais - diversão para toda a família.",
          },
          {
            name: "Parque Knorr",
            distance: "Aprox. 1,5 km",
            description:
              "Jardim botânico com mais de 1.000 espécies de plantas, trilhas e cachoeira.",
          },
        ],
        essentials: [
          {
            name: "Farmácia Panvel",
            type: "pharmacy",
            distance: "Aprox. 1 km",
            description: "Rede de farmácias com amplo estoque, aberta todos os dias.",
          },
          {
            name: "Supermercado Volpato",
            type: "supermarket",
            distance: "Aprox. 800 m",
            description: "Supermercado local bem abastecido, referência na cidade.",
          },
          {
            name: "Hospital Arco-Íris",
            type: "hospital",
            distance: "Aprox. 2,5 km",
            description: "Principal hospital da região com pronto-atendimento 24h.",
          },
        ],
        seasonalTip:
          "Junho é plena temporada de inverno em Gramado - temperaturas podem cair abaixo de 5°C à noite. Traga agasalho, cachecol e luvas. É também época do Natal Luz, com decoração especial na cidade.",
      },
    },
  });

  await prisma.property.upsert({
    where: { code: "POA001" },
    update: {},
    create: {
      code: "POA001",
      name: "Loft Gasômetro Porto Alegre",
      propertyType: "Loft",
      bedroomQuantity: 1,
      bathroomQuantity: 1,
      guestCapacity: 2,
      address: {
        street: "Rua João Alfredo",
        number: "346",
        complement: "Apto 52",
        neighborhood: "Cidade Baixa",
        city: "Porto Alegre",
        state: "RS",
        postalCode: "90050-230",
      },
      operational: {
        wifiNetwork: "LoftGasometro_POA",
        wifiPassword: "poa@loft2024",
        isSelfCheckin: true,
        propertyAccessType: "smart_lock",
        propertyAccessInstructions: "Use o código 3817 na fechadura eletrônica",
        propertyPassword: "3817",
        hasParkingSpot: false,
      },
      rules: {
        checkInTime: "15:00",
        checkOutTime: "11:00",
        allowPet: false,
        smokingPermitted: false,
        suitableForChildren: false,
        suitableForBabies: false,
        eventsPermitted: false,
      },
      amenities: {
        wifi: true,
        tv: true,
        airConditioning: true,
        kitchen: true,
        washingMachine: true,
      },
      images: [
        "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
      ],
      hostName: "Rodrigo Farias",
      hostPhone: "+5551998001234",
    },
  });

  await prisma.property.upsert({
    where: { code: "RIO001" },
    update: {},
    create: {
      code: "RIO001",
      name: "Apartamento Copacabana Rio",
      propertyType: "Apartamento",
      bedroomQuantity: 2,
      bathroomQuantity: 1,
      guestCapacity: 4,
      address: {
        street: "Rua Santa Clara",
        number: "234",
        complement: "Apto 801",
        neighborhood: "Copacabana",
        city: "Rio de Janeiro",
        state: "RJ",
        postalCode: "22041-010",
      },
      operational: {
        wifiNetwork: "SeaHome_RIO001",
        wifiPassword: "copacabana2024",
        isSelfCheckin: true,
        propertyAccessType: "keybox",
        propertyAccessInstructions: "Cofre na portaria, código 5592",
        propertyPassword: "5592",
        hasParkingSpot: false,
      },
      rules: {
        checkInTime: "15:00",
        checkOutTime: "11:00",
        allowPet: false,
        smokingPermitted: false,
        suitableForChildren: true,
        suitableForBabies: true,
        eventsPermitted: false,
      },
      amenities: {
        wifi: true,
        tv: true,
        airConditioning: true,
        kitchen: true,
        balcony: true,
      },
      images: [
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
      ],
      hostName: "Beatriz Nunes",
      hostPhone: "+5521997654321",
    },
  });

  await prisma.property.upsert({
    where: { code: "CWB001" },
    update: {},
    create: {
      code: "CWB001",
      name: "Studio Jardim Botânico Curitiba",
      propertyType: "Studio",
      bedroomQuantity: 1,
      bathroomQuantity: 1,
      guestCapacity: 2,
      address: {
        street: "Rua Engenheiros Rebouças",
        number: "1512",
        complement: "Apto 34",
        neighborhood: "Rebouças",
        city: "Curitiba",
        state: "PR",
        postalCode: "80215-100",
      },
      operational: {
        wifiNetwork: "StudioBotanico_CWB",
        wifiPassword: "curitiba@2024",
        isSelfCheckin: true,
        propertyAccessType: "smart_lock",
        propertyAccessInstructions: "Use o código 6743 na fechadura digital",
        propertyPassword: "6743",
        hasParkingSpot: true,
        parkingSpotIdentifier: "Vaga 08",
        parkingSpotInstructions: "Estacionamento coberto no subsolo",
      },
      rules: {
        checkInTime: "14:00",
        checkOutTime: "12:00",
        allowPet: true,
        smokingPermitted: false,
        suitableForChildren: false,
        suitableForBabies: false,
        eventsPermitted: false,
      },
      amenities: {
        wifi: true,
        tv: true,
        airConditioning: true,
        kitchen: true,
        washingMachine: true,
        elevator: true,
      },
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      ],
      hostName: "Fernanda Oliveira",
      hostPhone: "+5541996543210",
    },
  });

  await prisma.experienceGuide.upsert({
    where: { propertyCode: "POA001" },
    update: {},
    create: {
      propertyCode: "POA001",
      content: {
        welcomeMessage:
          "Seu loft fica na Cidade Baixa, o bairro mais vibrante de Porto Alegre. A poucos passos da Usina do Gasômetro e do Guaíba, você terá a melhor vista do pôr do sol da cidade e acesso fácil à cena gastronômica e cultural gaúcha.",
        restaurants: [
          {
            name: "Chalé da Praça XV",
            distance: "Aprox. 800 m",
            description:
              "Restaurante histórico de Porto Alegre, funcionando desde 1885. Especialidade em frango ao molho pardo e ambiente de boteco tradicional gaúcho.",
          },
          {
            name: "Bar Ocidente",
            distance: "Aprox. 600 m",
            description:
              "Ícone da Cidade Baixa com música ao vivo, chopps gelados e petiscos clássicos em ambiente agitado.",
          },
          {
            name: "Figueira Restaurante",
            distance: "Aprox. 1,2 km",
            description:
              "Culinária contemporânea com ingredientes regionais gaúchos, cardápio sazonal e ambiente sofisticado.",
          },
          {
            name: "Pizzaria Guanabara",
            distance: "Aprox. 400 m",
            description:
              "Tradicional pizzaria do bairro, referência em pizza a lenha desde os anos 70.",
          },
        ],
        attractions: [
          {
            name: "Usina do Gasômetro",
            distance: "Aprox. 500 m",
            description:
              "Centro cultural icônico às margens do Guaíba. Imperdível ao entardecer para o pôr do sol mais famoso do Brasil.",
          },
          {
            name: "Parque Farroupilha",
            distance: "Aprox. 1,5 km",
            description:
              "O maior parque urbano de Porto Alegre, com jardins, lago, feirinha do Brique e a famosa Redenção nos domingos.",
          },
          {
            name: "Mercado Público Central",
            distance: "Aprox. 1,8 km",
            description:
              "Patrimônio histórico com mais de 150 anos, reúne gastronomia, artesanato e o tradicional Bar Brahma.",
          },
        ],
        essentials: [
          {
            name: "Farmácia Panvel",
            type: "pharmacy",
            distance: "Aprox. 300 m",
            description: "Rede gaúcha com amplo estoque, aberta todos os dias.",
          },
          {
            name: "Supermercado Zaffari",
            type: "supermarket",
            distance: "Aprox. 1 km",
            description: "Rede premium gaúcha com grande variedade de produtos e hortifrúti fresco.",
          },
          {
            name: "Hospital de Clínicas de Porto Alegre",
            type: "hospital",
            distance: "Aprox. 2 km",
            description: "Principal hospital universitário do RS, referência nacional com atendimento 24h.",
          },
        ],
        seasonalTip:
          "Junho em Porto Alegre costuma ser frio e chuvoso, com temperaturas entre 8°C e 16°C. Traga casaco e guarda-chuva. As tardes de sol são raras, mas o pôr do sol no Gasômetro vale muito a pena quando acontece.",
      },
    },
  });

  await prisma.experienceGuide.upsert({
    where: { propertyCode: "RIO001" },
    update: {},
    create: {
      propertyCode: "RIO001",
      content: {
        welcomeMessage:
          "Bem-vindo a Copacabana! Seu apartamento fica a dois quarteirões da praia mais famosa do mundo. Aqui você tem tudo na porta: mar, gastronomia, cultura e o melhor da efervescência carioca.",
        restaurants: [
          {
            name: "Cervantes",
            distance: "Aprox. 400 m",
            description:
              "Lanchonete lendária de Copacabana, famosa pelo pão de pernil com abacaxi. Fila na calçada faz parte da experiência.",
          },
          {
            name: "Restaurante Shirley",
            distance: "Aprox. 700 m",
            description:
              "Referência em frutos do mar em Copacabana desde 1934. Bacalhau e camarão são os destaques do cardápio.",
          },
          {
            name: "La Trattoria",
            distance: "Aprox. 1,5 km",
            description:
              "Culinária italiana clássica no Ipanema, ideal para um jantar mais sofisticado.",
          },
          {
            name: "Bibi Sucos",
            distance: "Aprox. 200 m",
            description:
              "Rede carioca de sucos naturais e lanches rápidos. Perfeito para um café da manhã pós-praia.",
          },
        ],
        attractions: [
          {
            name: "Forte de Copacabana",
            distance: "Aprox. 1,2 km",
            description:
              "Fortaleza histórica na ponta de Copacabana com museu, café e vista panorâmica para o Atlântico.",
          },
          {
            name: "Pão de Açúcar",
            distance: "Aprox. 4 km",
            description:
              "Teleférico até o topo com vista 360° da cidade. Um dos cartões-postais mais icônicos do Brasil.",
          },
          {
            name: "Cristo Redentor",
            distance: "Aprox. 9 km",
            description:
              "Uma das 7 maravilhas do mundo moderno. Vista incrível de toda a cidade do Rio de Janeiro.",
          },
        ],
        essentials: [
          {
            name: "Farmácia Pacheco",
            type: "pharmacy",
            distance: "Aprox. 150 m",
            description: "Rede tradicional carioca, aberta 24h com ótima disponibilidade de medicamentos.",
          },
          {
            name: "Supermercado Zona Sul",
            type: "supermarket",
            distance: "Aprox. 300 m",
            description: "Rede premium carioca com hortifrúti fresco, padaria e variedade de importados.",
          },
          {
            name: "Hospital Samaritano Botafogo",
            type: "hospital",
            distance: "Aprox. 3 km",
            description: "Hospital de referência no Rio com atendimento de urgência e emergência 24h.",
          },
        ],
        seasonalTip:
          "Junho no Rio ainda tem dias quentes (22°C–28°C), mas as noites refrescam. Leve uma jaqueta leve para as saídas à noite. A praia fica menos cheia que no verão - ótimo momento para curtir Copacabana com mais tranquilidade.",
      },
    },
  });

  await prisma.experienceGuide.upsert({
    where: { propertyCode: "CWB001" },
    update: {},
    create: {
      propertyCode: "CWB001",
      content: {
        welcomeMessage:
          "Seu studio fica no Rebouças, a poucos minutos a pé do Jardim Botânico de Curitiba. Explore a cidade mais organizada do Brasil: parques, gastronomia premiada e uma arquitetura que mistura influências europeias com design moderno.",
        restaurants: [
          {
            name: "Durski",
            distance: "Aprox. 2 km",
            description:
              "Restaurante polonês e ucraniano premiado, um dos mais famosos de Curitiba. Destaque para o pierogi e o borscht.",
          },
          {
            name: "Chez Maurice",
            distance: "Aprox. 3 km",
            description:
              "Referência da gastronomia francesa em Curitiba, com menu dégustation e ambiente íntimo e sofisticado.",
          },
          {
            name: "Madalosso",
            distance: "Aprox. 12 km",
            description:
              "O maior restaurante do Brasil, em Santa Felicidade. Culinária ítalo-brasileira e cantina tradicional que vale a viagem.",
          },
          {
            name: "Famiglia Fadanelli",
            distance: "Aprox. 2,5 km",
            description:
              "Cantina italiana clássica no Batel com massas artesanais e ambiente acolhedor.",
          },
        ],
        attractions: [
          {
            name: "Jardim Botânico de Curitiba",
            distance: "Aprox. 600 m",
            description:
              "Cartão-postal da cidade com a famosa estufa de ferro e vidro, jardins formais e trilhas - entrada gratuita.",
          },
          {
            name: "Museu Oscar Niemeyer",
            distance: "Aprox. 2,5 km",
            description:
              "Museu de arte contemporânea projetado por Niemeyer, com exposições permanentes e temporárias de grande relevância.",
          },
          {
            name: "Ópera de Arame",
            distance: "Aprox. 6 km",
            description:
              "Teatro construído em tubos de aço sobre uma pedreira desativada, cercado de lago e natureza - estrutura única no mundo.",
          },
        ],
        essentials: [
          {
            name: "Farmácia Nissei",
            type: "pharmacy",
            distance: "Aprox. 400 m",
            description: "Rede paranaense de farmácias com amplo estoque e atendimento diário.",
          },
          {
            name: "Condor Supermercado",
            type: "supermarket",
            distance: "Aprox. 700 m",
            description: "Rede curitibana de supermercados, bem abastecida e com preços acessíveis.",
          },
          {
            name: "Hospital Evangélico Mackenzie",
            type: "hospital",
            distance: "Aprox. 1,5 km",
            description: "Um dos principais hospitais de Curitiba, com pronto-socorro 24h.",
          },
        ],
        seasonalTip:
          "Curitiba em junho é bastante fria - espere temperaturas entre 5°C e 15°C, com geadas ocasionais nas madrugadas. Traga casaco pesado, cachecol e luvas. Os dias ensolarados são revigorantes, mas as noites pedem camadas extras.",
      },
    },
  });

  console.log("Seed concluído: FLN001, GRM001, POA001, RIO001 e CWB001 inseridos.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
