import { sendMessageToAI } from './src/services/ai.js';
import { USERS } from './src/lib/data.js';

const user = Object.values(USERS)[0]; // get the first user

async function test() {
  try {
    const res = await sendMessageToAI('Tengo fiebre y malestar del cuerpo y vivo en la ciudad de Manta', [], user);
    console.log('SUCCESS:', res);
  } catch (err) {
    console.error('ERROR CAUGHT:', err);
  }
}
test();
