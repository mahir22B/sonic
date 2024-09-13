// // const express = require('express');
// // const multer = require('multer');
// // const cors = require('cors');
// // const axios = require('axios');
// // const fs = require('fs').promises;
// // const Anthropic = require('@anthropic-ai/sdk');
// // const { ElevenLabsClient, ElevenLabs } = require("elevenlabs");
// // const PDFExtract = require('pdf.js-extract').PDFExtract;
// // const mime = require('mime-types');
// // const path = require('path');
// // const stream = require('stream');
// // const { promisify } = require('util');
// // const pipeline = promisify(stream.pipeline);

// // const app = express();
// // app.use(cors());
// // const upload = multer({ 
// //   dest: 'uploads/',
// //   limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
// // });

// // const pdfExtract = new PDFExtract();
// // const options = {}; // PDF extract options

// // // Initialize Anthropic client for Claude 3 Haiku
// // const anthropic = new Anthropic({
// //   apiKey: "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",
// // });

// // // Initialize ElevenLabs client
// // const elevenLabsClient = new ElevenLabsClient({
// //   apiKey: "sk_554134bac2b145530d224935f93b01674c35caaf388308c6",
// // });

// // const systemPrompt = `You are an AI assistant that creates engaging podcast-style conversations about research papers. Your task is to generate a dialogue between a Host and a Guest, strictly based on the content of the given research paper. Follow these guidelines:

// // 1. Content:
// //    - Start the conversation directly with the host's first question. Do not include any introductory text.
// //    - Discuss ONLY the information presented in the paper.
// //    - Do not add any external information or speculation not found in the paper.
// //    - Output each of the speaker's content in paragraphs   
// //    - Cover the paper's introduction, methodology, results, and conclusions.

// // 2. Conversation Style:
// //    - Host: A curious interviewer who asks probing questions about the paper's content and asks follow up questions as well.
// //    - Guest: An expert who provides detailed answers based solely on the paper's content. While the guest is an expert on the topic, the guest has no contribution in writing the paper.

// // 3. Structure:
// //    - Begin with an introduction of the paper's title and main topic.
// //    - Progress through the paper's sections in a logical order and explain complicated terms/ideas.
// //    - Conclude with a summary of the paper's key findings.

// // 4. Host's Role:
// //    - Ask clear, specific questions about different aspects of the paper.
// //    - Seek clarifications on complex concepts or methodologies.
// //    - Express curiosity and enthusiasm about the research.
// //    - Guide the conversation to cover all major points of the paper.
// //    - Ask the guest where do we go from here and how would paper impact the future

// // 5. Guest's Role:
// //    - Provide detailed explanations based strictly on the paper's content.
// //    - Break down complex ideas into understandable terms.
// //    - Refer to specific sections, data, or findings from the paper.

// // 6. Engagement:
// //    - Maintain a natural flow of conversation.
// //    - Use analogies or examples mentioned in the paper to illustrate points.
// //    - Keep the tone informative and engaging.

// // 7. Formatting:
// //    - Prefix each speaker's dialogue with 'HOST:' or 'GUEST:' to differentiate between them.
// //    - Use appropriate punctuation for readability.

// // Remember, the goal is to present the paper's content in an engaging, conversational format without adding any information beyond what is explicitly stated in the paper.`;

// // async function generateConversation(text) {
// //   const userPrompt = `Convert the following research paper text into a detailed conversation between a host and a guest, explaining the paper. Follow the guidelines provided in the system message to create an engaging, informative dialogue that strictly adheres to the paper's content:\n\n${text}`;

// //   const message = await anthropic.messages.create({
// //     model: "claude-3-haiku-20240307",
// //     max_tokens: 4000,
// //     temperature: 0.7,
// //     system: systemPrompt,
// //     messages: [
// //       {
// //         role: "user",
// //         content: userPrompt
// //       }
// //     ]
// //   });

// //   const conversation = message.content[0].text;
// //   console.log('Generated conversation:');
// //   console.log(conversation);

// //   return conversation;
// // }

// // function processText(text) {
// //   const lines = text.split('\n');
// //   let processedText = '';
// //   let currentSpeaker = '';
// //   let currentContent = '';

// //   for (const line of lines) {
// //     if (line.startsWith('HOST:') || line.startsWith('GUEST:')) {
// //       if (currentSpeaker && currentContent) {
// //         // Add the previous speaker's content
// //         processedText += `${currentSpeaker}: ${currentContent.trim()}\n\n`;
// //       }
// //       [currentSpeaker, ...content] = line.split(':');
// //       currentContent = content.join(':').trim() + ' ';
// //     } else {
// //       // Append the line to the current content, replacing line breaks with spaces
// //       currentContent += line.trim() + ' ';
// //     }
// //   }

// //   // Add the last speaker's content
// //   if (currentSpeaker && currentContent) {
// //     processedText += `${currentSpeaker}: ${currentContent.trim()}\n`;
// //   }

// //   return processedText.trim();
// // }

// // async function textToSpeech(text) {
// //   const VOICE_ID_HOST = 'OU5nDzoAOc9Vbsn1urK6';  
// //   const VOICE_ID_GUEST = 'IeBU8fm39GsOVbdH6dun';  

// //   const parts = text.split('\n');
// //   let audioBuffers = [];

// //   for (const part of parts) {
// //     const [speaker, ...content] = part.split(':');
// //     const textContent = content.join(':').trim();
    
// //     if (!textContent) {
// //       console.log('Skipping empty content');
// //       continue;
// //     }

// //     const voiceId = speaker.trim() === 'HOST' ? VOICE_ID_HOST : VOICE_ID_GUEST;

// //     try {
// //       console.log('Sending request to ElevenLabs API...');
// //       console.log('Text content:', textContent.substring(0, 100) + '...');
      
// //       const response = await elevenLabsClient.textToSpeech.convert(voiceId, {
// //         optimize_streaming_latency: ElevenLabs.OptimizeStreamingLatency.Zero,
// //         output_format: ElevenLabs.OutputFormat.Mp3,
// //         text: textContent,
// //         voice_settings: {
// //           stability: 0.5,
// //           similarity_boost: 0.5
// //         }
// //       });

// //       console.log('Received response from ElevenLabs API');
// //       console.log('Response type:', typeof response);
// //       console.log('Response properties:', Object.keys(response));

// //       if (response && response.readableStream) {
// //         console.log('Response is a Node18UniversalStreamWrapper');
// //         const chunks = [];
// //         const passThrough = new stream.PassThrough();

// //         response.pipe(passThrough);

// //         try {
// //           await pipeline(
// //             passThrough,
// //             new stream.Writable({
// //               write(chunk, encoding, callback) {
// //                 chunks.push(chunk);
// //                 callback();
// //               }
// //             })
// //           );

// //           const audioBuffer = Buffer.concat(chunks);
// //           console.log(`Received audio data: ${audioBuffer.length} bytes`);
// //           audioBuffers.push(audioBuffer);
// //         } catch (err) {
// //           console.error('Error reading stream:', err);
// //           throw err;
// //         }
// //       } else {
// //         console.log('Unexpected response type');
// //         console.log('Response:', response);
// //         throw new Error('Unexpected response type from ElevenLabs API');
// //       }
// //     } catch (error) {
// //       console.error('ElevenLabs API error:', error);
// //       if (error.statusCode === 401) {
// //         console.error('Authentication failed. Please check your API key and account status.');
// //       } else {
// //         console.error('Unexpected error:', error.message);
// //       }
// //       throw error;
// //     }
// //   }

// //   if (audioBuffers.length > 0) {
// //     const finalBuffer = Buffer.concat(audioBuffers);
// //     console.log(`Final audio buffer size: ${finalBuffer.length} bytes`);
// //     return finalBuffer;
// //   } else {
// //     console.log('No audio data received');
// //     throw new Error('No audio data received from ElevenLabs API');
// //   }
// // }

// // app.post('/api/process', upload.single('file'), async (req, res) => {
// //   try {
// //     let text;
// //     if (req.file) {
// //       console.log('File received:', req.file);
// //       const isValidPDF = 
// //         req.file.mimetype === 'application/pdf' || 
// //         path.extname(req.file.originalname).toLowerCase() === '.pdf';

// //       if (!isValidPDF) {
// //         return res.status(400).json({ error: 'Uploaded file is not a valid PDF.' });
// //       }

// //       try {
// //         const data = await pdfExtract.extract(req.file.path, options);
// //         text = data.pages.map(page => page.content.map(item => item.str).join(' ')).join('\n');
// //       } catch (pdfError) {
// //         console.error('PDF parsing error:', pdfError);
// //         console.error('Error details:', JSON.stringify(pdfError, Object.getOwnPropertyNames(pdfError)));
// //         return res.status(400).json({ error: 'Failed to parse PDF. The file may be corrupted or in an unsupported format.' });
// //       } finally {
// //         // Clean up the uploaded file
// //         await fs.unlink(req.file.path);
// //       }
// //     } else if (req.body.url) {
// //       try {
// //         const response = await axios.get(req.body.url, { responseType: 'arraybuffer' });
// //         const data = await pdfExtract.extractBuffer(response.data, options);
// //         text = data.pages.map(page => page.content.map(item => item.str).join(' ')).join('\n');
// //       } catch (pdfError) {
// //         console.error('PDF fetching or parsing error:', pdfError);
// //         console.error('Error details:', JSON.stringify(pdfError, Object.getOwnPropertyNames(pdfError)));
// //         return res.status(400).json({ error: 'Failed to fetch or parse PDF from the provided URL.' });
// //       }
// //     } else {
// //       return res.status(400).json({ error: 'No file or URL provided' });
// //     }

// //     // Generate conversation only if we have text
// //     if (text && text.trim().length > 0) {
// //       try {
// //         console.log('Generating conversation...');
// //         const conversation = await generateConversation(text);
// //         console.log('Conversation generated, length:', conversation.length);
        
// //         console.log('Processing text...');
// //         const processedConversation = processText(conversation);
// //         console.log('Text processed, length:', processedConversation.length);

// //         console.log('Starting text-to-speech conversion...');
// //         const audioBuffer = await textToSpeech(processedConversation);
// //         console.log('Text-to-speech conversion completed, audio size:', audioBuffer.length);

// //         console.log('Sending audio to client...');
// //         res.set({
// //           'Content-Type': 'audio/mpeg',
// //           'Content-Length': audioBuffer.length
// //         });
// //         res.send(audioBuffer);
// //         console.log('Audio sent to client');

// //       } catch (error) {
// //         console.error('Error in processing:', error);
// //         res.status(500).json({ 
// //           error: 'An error occurred during processing', 
// //           details: error.message,
// //           stack: error.stack
// //         });
// //       }
// //     } else {
// //       res.status(400).json({ error: 'Failed to extract text from the provided file or URL' });
// //     }
// //   } catch (error) {
// //     console.error('Unexpected error:', error);
// //     res.status(500).json({ 
// //       error: 'An unexpected error occurred during processing', 
// //       details: error.message,
// //       stack: error.stack
// //     });
// //   }
// // });

// // const PORT = process.env.PORT || 3001;
// // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// const express = require('express');
// const multer = require('multer');
// const cors = require('cors');
// const axios = require('axios');
// const fs = require('fs').promises;
// const Anthropic = require('@anthropic-ai/sdk');
// const { ElevenLabsClient, ElevenLabs } = require("elevenlabs");
// const PDFExtract = require('pdf.js-extract').PDFExtract;
// const mime = require('mime-types');
// const path = require('path');
// const stream = require('stream');
// const { promisify } = require('util');
// const pipeline = promisify(stream.pipeline);
// const cheerio = require('cheerio');

// const app = express();
// app.use(cors());
// const upload = multer({ 
//   dest: 'uploads/',
//   limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
// });

// const pdfExtract = new PDFExtract();
// const options = {}; // PDF extract options

// // Initialize Anthropic client for Claude 3 Haiku
// const anthropic = new Anthropic({
//   apiKey: "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",
// });

// // Initialize ElevenLabs client
// const elevenLabsClient = new ElevenLabsClient({
//   apiKey: "sk_554134bac2b145530d224935f93b01674c35caaf388308c6",
// });

// const systemPrompt = `You are an AI assistant that creates engaging podcast-style conversations about research papers. Your task is to generate a dialogue between a Host and a Guest, strictly based on the content of the given research paper. Follow these guidelines:

// 1. Content:
//    - Start the conversation directly with the host's first question. Do not include any introductory text.
//    - Discuss ONLY the information presented in the paper.
//    - Do not add any external information or speculation not found in the paper.
//    - Output each of the speaker's content in paragraphs   
//    - Cover the paper's introduction, methodology, results, and conclusions.
//    - STRICTLY keep the plesentaries at the end and at the start very very very minimum.

// 2. Conversation Style:
//    - Host: A curious interviewer who asks probing questions about the paper's content and asks follow up questions as well.
//    - Guest: An expert who provides detailed answers based solely on the paper's content. While the guest is an expert on the topic, the guest has no contribution in writing the paper.

// 3. Structure:
//    - Begin with an introduction of the paper's title and main topic.
//    - Progress through the paper's sections in a logical order and explain complicated terms/ideas.
//    - Conclude with a summary of the paper's key findings.

// 4. Host's Role:
//    - Ask clear, specific questions about different aspects of the paper.
//    - Seek clarifications on complex concepts or methodologies.
//    - Express curiosity and enthusiasm about the research.
//    - Guide the conversation to cover all major points of the paper.
//    - Ask the guest where do we go from here and how would paper impact the future
//    - STRICTLY keep the plesentaries at the end and at the start very very very minimum.

// 5. Guest's Role:
//    - Provide detailed explanations based strictly on the paper's content.
//    - Break down complex ideas into understandable terms.
//    - Refer to specific sections, data, or findings from the paper.

// 6. Engagement:
//    - Maintain a natural flow of conversation.
//    - Use analogies or examples mentioned in the paper to illustrate points.
//    - Keep the tone informative and engaging.

// 7. Formatting:
//    - Prefix each speaker's dialogue with 'HOST:' or 'GUEST:' to differentiate between them.
//    - Use appropriate punctuation for readability.

// Remember, the goal is to present the paper's content in an engaging, conversational format without adding any information beyond what is explicitly stated in the paper.`;

// async function generateConversation(text) {
//   const userPrompt = `Convert the following research paper text into a detailed conversation between a host and a guest, explaining the paper. Follow the guidelines provided in the system message to create an engaging, informative dialogue that strictly adheres to the paper's content:\n\n${text}`;

//   const message = await anthropic.messages.create({
//     model: "claude-3-haiku-20240307",
//     max_tokens: 4000,
//     temperature: 0.7,
//     system: systemPrompt,
//     messages: [
//       {
//         role: "user",
//         content: userPrompt
//       }
//     ]
//   });

//   const conversation = message.content[0].text;
//   console.log('Generated conversation:');
//   console.log(conversation);

//   return conversation;
// }

// function processText(text) {
//   const lines = text.split('\n');
//   let processedText = '';
//   let currentSpeaker = '';
//   let currentContent = '';

//   for (const line of lines) {
//     if (line.startsWith('HOST:') || line.startsWith('GUEST:')) {
//       if (currentSpeaker && currentContent) {
//         // Add the previous speaker's content
//         processedText += `${currentSpeaker}: ${currentContent.trim()}\n\n`;
//       }
//       [currentSpeaker, ...content] = line.split(':');
//       currentContent = content.join(':').trim() + ' ';
//     } else {
//       // Append the line to the current content, replacing line breaks with spaces
//       currentContent += line.trim() + ' ';
//     }
//   }

//   // Add the last speaker's content
//   if (currentSpeaker && currentContent) {
//     processedText += `${currentSpeaker}: ${currentContent.trim()}\n`;
//   }

//   return processedText.trim();
// }

// async function textToSpeech(text) {
//   const VOICE_ID_HOST = 'OU5nDzoAOc9Vbsn1urK6';  
//   const VOICE_ID_GUEST = 'IeBU8fm39GsOVbdH6dun';  

//   const parts = text.split('\n');
//   let audioBuffers = [];

//   for (const part of parts) {
//     const [speaker, ...content] = part.split(':');
//     const textContent = content.join(':').trim();
    
//     if (!textContent) {
//       console.log('Skipping empty content');
//       continue;
//     }

//     const voiceId = speaker.trim() === 'HOST' ? VOICE_ID_HOST : VOICE_ID_GUEST;

//     try {
//       console.log('Sending request to ElevenLabs API...');
//       console.log('Text content:', textContent.substring(0, 100) + '...');
      
//       const response = await elevenLabsClient.textToSpeech.convert(voiceId, {
//         optimize_streaming_latency: ElevenLabs.OptimizeStreamingLatency.Zero,
//         output_format: ElevenLabs.OutputFormat.Mp3,
//         text: textContent,
//         voice_settings: {
//           stability: 0.5,
//           similarity_boost: 0.5
//         }
//       });

//       console.log('Received response from ElevenLabs API');
//       console.log('Response type:', typeof response);
//       console.log('Response properties:', Object.keys(response));

//       if (response && response.readableStream) {
//         console.log('Response is a Node18UniversalStreamWrapper');
//         const chunks = [];
//         const passThrough = new stream.PassThrough();

//         response.pipe(passThrough);

//         try {
//           await pipeline(
//             passThrough,
//             new stream.Writable({
//               write(chunk, encoding, callback) {
//                 chunks.push(chunk);
//                 callback();
//               }
//             })
//           );

//           const audioBuffer = Buffer.concat(chunks);
//           console.log(`Received audio data: ${audioBuffer.length} bytes`);
//           audioBuffers.push(audioBuffer);
//         } catch (err) {
//           console.error('Error reading stream:', err);
//           throw err;
//         }
//       } else {
//         console.log('Unexpected response type');
//         console.log('Response:', response);
//         throw new Error('Unexpected response type from ElevenLabs API');
//       }
//     } catch (error) {
//       console.error('ElevenLabs API error:', error);
//       if (error.statusCode === 401) {
//         console.error('Authentication failed. Please check your API key and account status.');
//       } else {
//         console.error('Unexpected error:', error.message);
//       }
//       throw error;
//     }
//   }

//   if (audioBuffers.length > 0) {
//     const finalBuffer = Buffer.concat(audioBuffers);
//     console.log(`Final audio buffer size: ${finalBuffer.length} bytes`);
//     return finalBuffer;
//   } else {
//     console.log('No audio data received');
//     throw new Error('No audio data received from ElevenLabs API');
//   }
// }

// app.post('/api/process', upload.single('file'), async (req, res) => {
//   try {
//     let text;
//     if (req.file) {
//       console.log('File received:', req.file);
//       const isValidPDF = 
//         req.file.mimetype === 'application/pdf' || 
//         path.extname(req.file.originalname).toLowerCase() === '.pdf';

//       if (!isValidPDF) {
//         return res.status(400).json({ error: 'Uploaded file is not a valid PDF.' });
//       }

//       try {
//         const data = await pdfExtract.extract(req.file.path, options);
//         text = data.pages.map(page => page.content.map(item => item.str).join(' ')).join('\n');
//       } catch (pdfError) {
//         console.error('PDF parsing error:', pdfError);
//         console.error('Error details:', JSON.stringify(pdfError, Object.getOwnPropertyNames(pdfError)));
//         return res.status(400).json({ error: 'Failed to parse PDF. The file may be corrupted or in an unsupported format.' });
//       } finally {
//         // Clean up the uploaded file
//         await fs.unlink(req.file.path);
//       }
//     } else if (req.body.url) {
//       try {
//         let pdfUrl = req.body.url;
        
//         // Check if it's an arXiv link
//         if (pdfUrl.includes('arxiv.org')) {
//           // Convert arXiv link to PDF download link
//           const arxivId = pdfUrl.split('/').pop().replace('.pdf', '');
//           pdfUrl = `https://arxiv.org/pdf/${arxivId}.pdf`;
//         }

//         const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
        
//         // Check if the response is HTML (which means it's not a direct PDF link)
//         const contentType = response.headers['content-type'];
//         if (contentType.includes('text/html')) {
//           // Parse the HTML to find the PDF link
//           const $ = cheerio.load(response.data.toString());
//           const pdfLink = $('a[title="Download PDF"]').attr('href');
//           if (pdfLink) {
//             pdfUrl = new URL(pdfLink, pdfUrl).href;
//             // Fetch the actual PDF
//             const pdfResponse = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
//             const data = await pdfExtract.extractBuffer(pdfResponse.data, options);
//             text = data.pages.map(page => page.content.map(item => item.str).join(' ')).join('\n');
//           } else {
//             throw new Error('Could not find PDF link on the page');
//           }
//         } else {
//           // If it's already a PDF, process it directly
//           const data = await pdfExtract.extractBuffer(response.data, options);
//           text = data.pages.map(page => page.content.map(item => item.str).join(' ')).join('\n');
//         }
//       } catch (pdfError) {
//         console.error('PDF fetching or parsing error:', pdfError);
//         console.error('Error details:', JSON.stringify(pdfError, Object.getOwnPropertyNames(pdfError)));
//         return res.status(400).json({ error: 'Failed to fetch or parse PDF from the provided URL.' });
//       }
//     } else {
//       return res.status(400).json({ error: 'No file or URL provided' });
//     }

//     // Generate conversation only if we have text
//     if (text && text.trim().length > 0) {
//       try {
//         console.log('Generating conversation...');
//         const conversation = await generateConversation(text);
//         console.log('Conversation generated, length:', conversation.length);
        
//         console.log('Processing text...');
//         const processedConversation = processText(conversation);
//         console.log('Text processed, length:', processedConversation.length);

//         console.log('Starting text-to-speech conversion...');
//         const audioBuffer = await textToSpeech(processedConversation);
//         console.log('Text-to-speech conversion completed, audio size:', audioBuffer.length);

//         console.log('Sending audio to client...');
//         res.set({
//           'Content-Type': 'audio/mpeg',
//           'Content-Length': audioBuffer.length
//         });
//         res.send(audioBuffer);
//         console.log('Audio sent to client');

//       } catch (error) {
//         console.error('Error in processing:', error);
//         res.status(500).json({ 
//           error: 'An error occurred during processing', 
//           details: error.message,
//           stack: error.stack
//         });
//       }
//     } else {
//       res.status(400).json({ error: 'Failed to extract text from the provided file or URL' });
//     }
//   } catch (error) {
//     console.error('Unexpected error:', error);
//     res.status(500).json({ 
//       error: 'An unexpected error occurred during processing', 
//       details: error.message,
//       stack: error.stack
//     });
//   }
// });

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



const express = require('express');
const multer = require('multer');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs').promises;
const Anthropic = require('@anthropic-ai/sdk');
const { ElevenLabsClient, ElevenLabs } = require("elevenlabs");
const PDFExtract = require('pdf.js-extract').PDFExtract;
const mime = require('mime-types');
const path = require('path');
const stream = require('stream');
const { promisify } = require('util');
const pipeline = promisify(stream.pipeline);
const cheerio = require('cheerio');

const app = express();
app.use(cors({
  origin: 'https://sonic-c40.pages.dev'
}));
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

app.get('/', (req, res) => {
    res.send('Backend Deployed');
  });

const pdfExtract = new PDFExtract();
const options = {}; // PDF extract options

// Define consistent voice IDs
const VOICE_ID_HOST = 'EXAVITQu4vr4xnSDxMaL';
const VOICE_ID_GUEST = 'VR6AewLTigWG4xSOukaG';

const systemPrompt = `You are an AI assistant that creates engaging podcast-style conversations about research papers. Your task is to generate a dialogue between a Host and a Guest, strictly based on the content of the given research paper. Follow these guidelines:

1. Content:
   - Start the conversation directly with the host's first question. Do not include any introductory text.
   - Discuss ONLY the information presented in the paper.
   - Do not add any external information or speculation not found in the paper.
   - Output each of the speaker's content in paragraphs   
   - Cover the paper's introduction, methodology, results, and conclusions.
   - STRICTLY keep the pleasantries at the end and at the start very very very minimum.

2. Conversation Style:
   - Host: A curious interviewer who asks probing questions about the paper's content and asks follow up questions as well.
   - Guest: An expert who provides detailed answers based solely on the paper's content. While the guest is an expert on the topic, the guest has no contribution in writing the paper.

3. Structure:
   - Begin with an introduction of the paper's title and main topic.
   - Progress through the paper's sections in a logical order and explain complicated terms/ideas.
   - Conclude with a summary of the paper's key findings.

4. Host's Role:
   - Ask clear, specific questions about different aspects of the paper.
   - Seek clarifications on complex concepts or methodologies.
   - Express curiosity and enthusiasm about the research.
   - Guide the conversation to cover all major points of the paper.
   - Ask the guest where do we go from here and how would paper impact the future
   - STRICTLY keep the pleasantries at the end and at the start very very very minimum.

5. Guest's Role:
   - Provide detailed explanations based strictly on the paper's content.
   - Break down complex ideas into understandable terms.
   - Refer to specific sections, data, or findings from the paper.

6. Engagement:
   - Maintain a natural flow of conversation.
   - Use analogies or examples mentioned in the paper to illustrate points.
   - Keep the tone informative and engaging.

7. Formatting:
   - Prefix each speaker's dialogue with 'HOST:' or 'GUEST:' to differentiate between them.
   - Use appropriate punctuation for readability.

Remember, the goal is to present the paper's content in an engaging, conversational format without adding any information beyond what is explicitly stated in the paper.`;

async function generateConversation(text, anthropic) {
  const userPrompt = `Convert the following research paper text into a detailed conversation between a host and a guest, explaining the paper. Follow the guidelines provided in the system message to create an engaging, informative dialogue that strictly adheres to the paper's content:\n\n${text}`;

  const message = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 4000,
    temperature: 0.7,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: userPrompt
      }
    ]
  });

  const conversation = message.content[0].text;
  console.log('Generated conversation:');
  console.log(conversation);

  return conversation;
}

function processText(text) {
  const lines = text.split('\n');
  let processedText = '';
  let currentSpeaker = '';
  let currentContent = '';

  for (const line of lines) {
    if (line.startsWith('HOST:') || line.startsWith('GUEST:')) {
      if (currentSpeaker && currentContent) {
        // Add the previous speaker's content
        processedText += `${currentSpeaker}: ${currentContent.trim()}\n\n`;
      }
      [currentSpeaker, ...content] = line.split(':');
      currentContent = content.join(':').trim() + ' ';
    } else {
      // Append the line to the current content, replacing line breaks with spaces
      currentContent += line.trim() + ' ';
    }
  }

  // Add the last speaker's content
  if (currentSpeaker && currentContent) {
    processedText += `${currentSpeaker}: ${currentContent.trim()}\n`;
  }

  return processedText.trim();
}

async function textToSpeech(text, elevenLabsClient) {
  const parts = text.split('\n');
  let audioBuffers = [];

  for (const part of parts) {
    const [speaker, ...content] = part.split(':');
    const textContent = content.join(':').trim();
    
    if (!textContent) {
      console.log('Skipping empty content');
      continue;
    }

    const voiceId = speaker.trim() === 'HOST' ? VOICE_ID_HOST : VOICE_ID_GUEST;

    try {
      console.log('Sending request to ElevenLabs API...');
      console.log('Text content:', textContent.substring(0, 100) + '...');
      
      const response = await elevenLabsClient.textToSpeech.convert(voiceId, {
        optimize_streaming_latency: ElevenLabs.OptimizeStreamingLatency.Zero,
        output_format: ElevenLabs.OutputFormat.Mp3,
        text: textContent,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      });

      console.log('Received response from ElevenLabs API');
      console.log('Response type:', typeof response);
      console.log('Response properties:', Object.keys(response));

      if (response && response.readableStream) {
        console.log('Response is a Node18UniversalStreamWrapper');
        const chunks = [];
        const passThrough = new stream.PassThrough();

        response.pipe(passThrough);

        try {
          await pipeline(
            passThrough,
            new stream.Writable({
              write(chunk, encoding, callback) {
                chunks.push(chunk);
                callback();
              }
            })
          );

          const audioBuffer = Buffer.concat(chunks);
          console.log(`Received audio data: ${audioBuffer.length} bytes`);
          audioBuffers.push(audioBuffer);
        } catch (err) {
          console.error('Error reading stream:', err);
          throw err;
        }
      } else {
        console.log('Unexpected response type');
        console.log('Response:', response);
        throw new Error('Unexpected response type from ElevenLabs API');
      }
    } catch (error) {
      console.error('ElevenLabs API error:', error);
      if (error.statusCode === 401) {
        console.error('Authentication failed. Please check your API key and account status.');
      } else {
        console.error('Unexpected error:', error.message);
      }
      throw error;
    }
  }

  if (audioBuffers.length > 0) {
    const finalBuffer = Buffer.concat(audioBuffers);
    console.log(`Final audio buffer size: ${finalBuffer.length} bytes`);
    return finalBuffer;
  } else {
    console.log('No audio data received');
    throw new Error('No audio data received from ElevenLabs API');
  }
}

app.post('/api/process', upload.single('file'), async (req, res) => {
  try {
    const claudeKey = req.body.claudeKey;
    const elevenLabsKey = req.body.elevenLabsKey;

    if (!claudeKey || !elevenLabsKey) {
      return res.status(400).json({ error: 'API keys are required' });
    }

    // Initialize clients with user-provided keys
    const anthropic = new Anthropic({ apiKey: claudeKey });
    const elevenLabsClient = new ElevenLabsClient({ apiKey: elevenLabsKey });

    let text;
    if (req.file) {
      console.log('File received:', req.file);
      const isValidPDF = 
        req.file.mimetype === 'application/pdf' || 
        path.extname(req.file.originalname).toLowerCase() === '.pdf';

      if (!isValidPDF) {
        return res.status(400).json({ error: 'Uploaded file is not a valid PDF.' });
      }

      try {
        const data = await pdfExtract.extract(req.file.path, options);
        text = data.pages.map(page => page.content.map(item => item.str).join(' ')).join('\n');
      } catch (pdfError) {
        console.error('PDF parsing error:', pdfError);
        console.error('Error details:', JSON.stringify(pdfError, Object.getOwnPropertyNames(pdfError)));
        return res.status(400).json({ error: 'Failed to parse PDF. The file may be corrupted or in an unsupported format.' });
      } finally {
        // Clean up the uploaded file
        await fs.unlink(req.file.path);
      }
    } else if (req.body.url) {
      try {
        let pdfUrl = req.body.url;
        
        // Check if it's an arXiv link
        if (pdfUrl.includes('arxiv.org')) {
          // Convert arXiv link to PDF download link
          const arxivId = pdfUrl.split('/').pop().replace('.pdf', '');
          pdfUrl = `https://arxiv.org/pdf/${arxivId}.pdf`;
        }

        const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
        
        // Check if the response is HTML (which means it's not a direct PDF link)
        const contentType = response.headers['content-type'];
        if (contentType.includes('text/html')) {
          // Parse the HTML to find the PDF link
          const $ = cheerio.load(response.data.toString());
          const pdfLink = $('a[title="Download PDF"]').attr('href');
          if (pdfLink) {
            pdfUrl = new URL(pdfLink, pdfUrl).href;
            // Fetch the actual PDF
            const pdfResponse = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
            const data = await pdfExtract.extractBuffer(pdfResponse.data, options);
            text = data.pages.map(page => page.content.map(item => item.str).join(' ')).join('\n');
          } else {
            throw new Error('Could not find PDF link on the page');
          }
        } else {
          // If it's already a PDF, process it directly
          const data = await pdfExtract.extractBuffer(response.data, options);
          text = data.pages.map(page => page.content.map(item => item.str).join(' ')).join('\n');
        }
      } catch (pdfError) {
        console.error('PDF fetching or parsing error:', pdfError);
        console.error('Error details:', JSON.stringify(pdfError, Object.getOwnPropertyNames(pdfError)));
        return res.status(400).json({ error: 'Failed to fetch or parse PDF from the provided URL.' });
      }
    } else {
      return res.status(400).json({ error: 'No file or URL provided' });
    }

    // Generate conversation only if we have text
    if (text && text.trim().length > 0) {
      try {
        console.log('Generating conversation...');
        const conversation = await generateConversation(text, anthropic);
        console.log('Conversation generated, length:', conversation.length);
        
        console.log('Processing text...');
        const processedConversation = processText(conversation);
        console.log('Text processed, length:', processedConversation.length);

        console.log('Starting text-to-speech conversion...');
        const audioBuffer = await textToSpeech(processedConversation, elevenLabsClient);
        console.log('Text-to-speech conversion completed, audio size:', audioBuffer.length);

        console.log('Sending audio to client...');
        res.set({
          'Content-Type': 'audio/mpeg',
          'Content-Length': audioBuffer.length
        });
        res.send(audioBuffer);
        console.log('Audio sent to client');

      } catch (error) {
        console.error('Error in processing:', error);
        res.status(500).json({ 
          error: 'An error occurred during processing', 
          details: error.message,
          stack: error.stack
        });
      }
    } else {
      res.status(400).json({ error: 'Failed to extract text from the provided file or URL' });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ 
      error: 'An unexpected error occurred during processing', 
      details: error.message,
      stack: error.stack
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));