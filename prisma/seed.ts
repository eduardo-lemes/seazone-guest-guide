import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Reset experience guides so seed data always wins over AI-generated cache
  await prisma.experienceGuide.deleteMany({
    where: { propertyCode: { in: ["FLN001", "GRM001"] } },
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
        parkingSpotIdentifier: "Vaga 12 — subsolo B1",
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
              "Mercado Público, Catedral, Palácio Cruz e Sousa — o coração histórico e cultural da cidade.",
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
              "Parque com maquetes em escala de monumentos mundiais — diversão para toda a família.",
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
          "Junho é plena temporada de inverno em Gramado — temperaturas podem cair abaixo de 5°C à noite. Traga agasalho, cachecol e luvas. É também época do Natal Luz, com decoração especial na cidade.",
      },
    },
  });

  console.log("Seed concluído: FLN001 e GRM001 inseridos.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
