import { GoogleGenAI, Type } from "@google/genai";
import type { Property } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const propertySchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING },
        address: { type: Type.STRING },
        city: { type: Type.STRING },
        state: { type: Type.STRING },
        neighborhood: { type: Type.STRING },
        lat: { type: Type.NUMBER },
        lng: { type: Type.NUMBER },
        priceMinorUnits: { type: Type.INTEGER, description: "Price in the smallest currency unit, e.g., cents." },
        currencyCode: { type: Type.STRING, description: "The ISO 4217 currency code, e.g., GHS or USD." },
        beds: { type: Type.INTEGER },
        baths: { type: Type.INTEGER },
        sqft: { type: Type.INTEGER },
        type: { type: Type.STRING, enum: ['For Sale', 'For Rent'] },
        verified: { type: Type.BOOLEAN },
        description: { type: Type.STRING },
        imageUrls: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
        },
        agentName: { type: Type.STRING },
        agentPhone: { type: Type.STRING },
        agentEmail: { type: Type.STRING },
    },
    required: ['id', 'address', 'city', 'state', 'neighborhood', 'lat', 'lng', 'priceMinorUnits', 'currencyCode', 'beds', 'baths', 'sqft', 'type', 'verified', 'description', 'imageUrls']
};

interface FindPropertiesResult {
    properties: Property[];
    isMockData: boolean;
}

// This function simulates a call to a backend API endpoint (e.g., /api/properties)
// In a real application, the Gemini call would be made on the server to protect the API key.
export const findProperties = async (location: string): Promise<FindPropertiesResult> => {
    try {
        const prompt = `Find 15 real estate properties for sale or rent in ${location}. Provide a diverse list including houses, apartments, and condos. For each property, include a unique ID, full address, city, state, neighborhood, latitude, longitude, price in the smallest currency unit (e.g., cents), an ISO 4217 currency code (e.g., GHS for Ghana), number of bedrooms, number of bathrooms, square footage, whether it's for sale or rent, a "verified" status (boolean), a compelling 2-3 sentence description, a list of at least 8 high-quality image URLs, and if available, the agent's name, WhatsApp-compatible phone number, and email.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        properties: {
                            type: Type.ARRAY,
                            items: propertySchema
                        }
                    },
                    required: ['properties']
                }
            }
        });
        
        const jsonText = response.text;
        const result = JSON.parse(jsonText);

        if (result && result.properties && Array.isArray(result.properties)) {
            return { properties: result.properties, isMockData: false };
        }

        console.error("Failed to parse properties from Gemini response:", result);
        return getMockProperties(location);

    } catch (error) {
        console.error('Error fetching properties from Gemini:', error);
        return getMockProperties(location);
    }
};

const getMockProperties = (location: string): FindPropertiesResult => {
    console.log(`Using mock data for ${location}`);
    const hashCode = (s: string) => s.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    const seed = hashCode(location.toLowerCase());

    const isGhana = location.toLowerCase().includes('accra') || location.toLowerCase().includes('ghana');
    const baseLat = isGhana ? 5.6037 : 34.0522;
    const baseLng = isGhana ? -0.1870 : -118.2437;
    const currencyCode = isGhana ? 'GHS' : 'USD';
    const neighborhoods = ['Downtown', 'Northside', 'River Valley', 'East End', 'Westwood'];
    
    // Fix: Explicitly type `properties` as `Property[]` to ensure the object shape matches the interface.
    const properties: Property[] = Array.from({ length: 15 }, (_, i) => {
        const id = `${seed}_${i + 1}`;
        const price = 250000 + Math.floor(Math.random() * 750000);
        const beds = 1 + Math.floor(Math.random() * 5);
        const baths = 1 + Math.floor(Math.random() * 3);
        const sqft = 900 + Math.floor(Math.random() * 2800);
        const hasAgent = Math.random() > 0.3; // 70% chance

        return {
            id,
            address: `${123 + i * 7} Main St, Apt ${i + 1}`,
            city: location.split(',')[0] || 'City',
            state: location.split(',')[1]?.trim() || 'State',
            neighborhood: neighborhoods[i % neighborhoods.length],
            lat: baseLat + (Math.random() - 0.5) * 0.1,
            lng: baseLng + (Math.random() - 0.5) * 0.1,
            priceMinorUnits: price * 100, // Store as minor units (cents)
            currencyCode: currencyCode,
            beds: beds,
            baths: baths,
            sqft: sqft,
            type: i % 3 === 0 ? 'For Rent' : 'For Sale',
            verified: Math.random() > 0.5,
            description: `A beautiful ${beds} bedroom, ${baths} bathroom property in the ${neighborhoods[i % neighborhoods.length]} neighborhood. Features a modern kitchen and spacious living areas. Perfect for families or professionals.`,
            imageUrls: Array.from({ length: 8 }, (_, j) => `https://picsum.photos/seed/${id}_${j + 1}/800/600`),
            agentName: hasAgent ? `Agent #${i + 1}` : undefined,
            agentPhone: hasAgent ? (isGhana ? '233244123456' : '14155552671') : undefined,
            agentEmail: hasAgent ? `agent${i + 1}@domus.co` : undefined,
        };
    });

    return { properties, isMockData: true };
};