const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = 'AIzaSyCjnLzjhDQZgrQ6I_yqT8mECBnrGdHc3Wc';
const genAI = new GoogleGenerativeAI(API_KEY);

async function testModels() {
    const modelsToTest = [
        'gemini-pro',
        'gemini-1.5-pro',
        'gemini-1.5-flash',
        'gemini-1.5-flash-latest',
        'gemini-2.0-flash-exp',
        'models/gemini-pro',
        'models/gemini-1.5-pro',
        'models/gemini-1.5-flash'
    ];

    console.log('🔍 Probando modelos disponibles...\n');

    for (const modelName of modelsToTest) {
        try {
            console.log(`Probando: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Hola');
            const response = await result.response;
            const text = response.text();
            console.log(`✅ ${modelName} FUNCIONA - Respuesta: ${text.substring(0, 50)}...\n`);
        } catch (error) {
            console.log(`❌ ${modelName} NO FUNCIONA - Error: ${error.message}\n`);
        }
    }
}

testModels();
