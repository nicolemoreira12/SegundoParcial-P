async function listModels() {
    const API_KEY = 'AIzaSyDjsxyNZeShpTGlptrPAiKYjtBKDGyb5WU';
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`);
        const data = await response.json();
        console.log('--- Modelos disponibles ---');
        if (data.models) {
            data.models.forEach(m => console.log(m.name));
        } else {
            console.log('Error o no hay modelos:', JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.log('Error en fetch:', e.message);
    }
}

listModels();
