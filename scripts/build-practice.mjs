/**
 * Build ~5–10 related drills (word groups / short sentences) for a head phrase.
 */

const TARGET_MIN = 5;
const TARGET_MAX = 10;

/** @type {Record<string, Array<[string, string, string]>>} */
const OVERRIDES = {
  你好: [
    ["您好", "nín hǎo", "Hello (polite)"],
    ["你好吗？", "nǐ hǎo ma?", "How are you?"],
    ["您好吗？", "nín hǎo ma?", "How are you? (polite)"],
    ["你好，请问…", "nǐ hǎo, qǐng wèn…", "Hello, may I ask…"],
    ["您好，我是游客", "nín hǎo, wǒ shì yóu kè", "Hello, I'm a tourist"],
    ["大家好，你好", "dà jiā hǎo, nǐ hǎo", "Hello everyone / hi"],
    ["你好，麻烦你了", "nǐ hǎo, má fan nǐ le", "Hello — thanks for the help"],
    ["再见，你好！", "zài jiàn — nǐ hǎo!", "Bye — and hello! (practice both)"],
  ],
  谢谢: [
    ["谢谢你", "xiè xie nǐ", "Thank you"],
    ["谢谢您", "xiè xie nín", "Thank you (polite)"],
    ["非常感谢", "fēi cháng gǎn xiè", "Thank you very much"],
    ["太谢谢了", "tài xiè xie le", "Thanks so much"],
    ["谢谢，再见", "xiè xie, zài jiàn", "Thank you, goodbye"],
    ["谢谢你的帮助", "xiè xie nǐ de bāng zhù", "Thank you for your help"],
    ["先谢谢了", "xiān xiè xie le", "Thanks in advance"],
    ["不用谢，谢谢你", "bú yòng xiè — xiè xie nǐ", "No need — thank you"],
  ],
  不用客气: [
    ["不客气", "bú kè qi", "You're welcome"],
    ["没事，不用客气", "méi shì, bú yòng kè qi", "It's fine, you're welcome"],
    ["应该的，不用客气", "yīng gāi de, bú yòng kè qi", "Of course — you're welcome"],
    ["小意思，不用客气", "xiǎo yì si, bú yòng kè qi", "It's nothing — you're welcome"],
    ["真的不用客气", "zhēn de bú yòng kè qi", "Really, you're welcome"],
    ["谢谢！— 不用客气", "xiè xie! — bú yòng kè qi", "Thanks! — You're welcome"],
    ["太客气了，不用客气", "tài kè qi le, bú yòng kè qi", "You're too kind — no need"],
  ],
  对不起: [
    ["实在对不起", "shí zài duì bu qǐ", "I'm truly sorry"],
    ["对不起，我迟到了", "duì bu qǐ, wǒ chí dào le", "Sorry, I'm late"],
    ["对不起，打扰了", "duì bu qǐ, dǎ rǎo le", "Sorry to bother you"],
    ["对不起，我听错了", "duì bu qǐ, wǒ tīng cuò le", "Sorry, I misheard"],
    ["对不起，可以再说一遍吗？", "duì bu qǐ, kě yǐ zài shuō yí biàn ma?", "Sorry, can you say that again?"],
    ["真对不起", "zhēn duì bu qǐ", "I'm really sorry"],
    ["对不起，走错了", "duì bu qǐ, zǒu cuò le", "Sorry, I went the wrong way"],
  ],
  没关系: [
    ["没关系，慢慢来", "méi guān xi, màn màn lái", "It's okay, take your time"],
    ["没事，没关系", "méi shì, méi guān xi", "No worries, it's fine"],
    ["没关系，别担心", "méi guān xi, bié dān xīn", "It's fine, don't worry"],
    ["没关系，我可以等", "méi guān xi, wǒ kě yǐ děng", "No problem, I can wait"],
    ["对不起。— 没关系", "duì bu qǐ. — méi guān xi", "Sorry. — It's okay"],
    ["完全没关系", "wán quán méi guān xi", "Totally fine"],
    ["没关系，谢谢你", "méi guān xi, xiè xie nǐ", "It's okay — thank you"],
  ],
  请问: [
    ["请问，洗手间在哪里？", "qǐng wèn, xǐ shǒu jiān zài nǎ lǐ?", "Excuse me, where is the restroom?"],
    ["请问，这个多少钱？", "qǐng wèn, zhè ge duō shao qián?", "Excuse me, how much is this?"],
    ["请问，地铁站怎么走？", "qǐng wèn, dì tiě zhàn zěn me zǒu?", "Excuse me, how do I get to the subway?"],
    ["请问，你会说英语吗？", "qǐng wèn, nǐ huì shuō yīng yǔ ma?", "Excuse me, do you speak English?"],
    ["请问，可以帮忙吗？", "qǐng wèn, kě yǐ bāng máng ma?", "Excuse me, can you help?"],
    ["你好，请问…", "nǐ hǎo, qǐng wèn…", "Hello, may I ask…"],
    ["请问一下", "qǐng wèn yí xià", "May I ask a quick question?"],
    ["请问，附近有酒店吗？", "qǐng wèn, fù jìn yǒu jiǔ diàn ma?", "Excuse me, is there a hotel nearby?"],
  ],
  我听不懂: [
    ["对不起，我听不懂", "duì bu qǐ, wǒ tīng bu dǒng", "Sorry, I don't understand"],
    ["请说慢一点，我听不懂", "qǐng shuō màn yì diǎn, wǒ tīng bu dǒng", "Please speak slowly — I don't understand"],
    ["我中文不好，听不懂", "wǒ zhōng wén bù hǎo, tīng bu dǒng", "My Chinese isn't good — I don't understand"],
    ["这个词我听不懂", "zhè ge cí wǒ tīng bu dǒng", "I don't understand this word"],
    ["你说的我听不懂", "nǐ shuō de wǒ tīng bu dǒng", "I don't understand what you said"],
    ["不好意思，我还是听不懂", "bù hǎo yì si, wǒ hái shì tīng bu dǒng", "Sorry, I still don't understand"],
    ["有英文吗？我听不懂", "yǒu yīng wén ma? wǒ tīng bu dǒng", "Is there English? I don't understand"],
  ],
  "请再说一遍": [
    ["请慢一点再说一遍", "qǐng màn yì diǎn zài shuō yí biàn", "Please say it again slowly"],
    ["不好意思，请再说一遍", "bù hǎo yì si, qǐng zài shuō yí biàn", "Excuse me, please say that again"],
    ["可以再说一遍吗？", "kě yǐ zài shuō yí biàn ma?", "Can you say that again?"],
    ["请再大声一点说一遍", "qǐng zài dà shēng yì diǎn shuō yí biàn", "Please say it again a bit louder"],
    ["最后一个字请再说一遍", "zuì hòu yí gè zì qǐng zài shuō yí biàn", "Please repeat the last word"],
    ["我对了吗？请再说一遍", "wǒ duì le ma? qǐng zài shuō yí biàn", "Did I get it? Please say it again"],
    ["听不清，请再说一遍", "tīng bu qīng, qǐng zài shuō yí biàn", "I can't hear clearly — please repeat"],
  ],
  "你会说英语吗？": [
    ["请问，你会说英语吗？", "qǐng wèn, nǐ huì shuō yīng yǔ ma?", "Excuse me, do you speak English?"],
    ["我只会一点中文", "wǒ zhǐ huì yì diǎn zhōng wén", "I only speak a little Chinese"],
    ["会说一点英语就行", "huì shuō yì diǎn yīng yǔ jiù xíng", "A little English is fine"],
    ["这里有人会英语吗？", "zhè lǐ yǒu rén huì yīng yǔ ma?", "Does anyone here speak English?"],
    ["英语菜单有吗？", "yīng yǔ cài dān yǒu ma?", "Do you have an English menu?"],
    ["我听不懂中文，你会英语吗？", "wǒ tīng bu dǒng zhōng wén, nǐ huì yīng yǔ ma?", "I don't understand Chinese — do you speak English?"],
    ["可以说慢一点英语吗？", "kě yǐ shuō màn yì diǎn yīng yǔ ma?", "Can you speak English a bit slowly?"],
  ],
  "多少钱？": [
    ["这个多少钱？", "zhè ge duō shao qián?", "How much is this?"],
    ["一共多少钱？", "yí gòng duō shao qián?", "How much in total?"],
    ["那个多少钱？", "nà ge duō shao qián?", "How much is that?"],
    ["一斤多少钱？", "yì jīn duō shao qián?", "How much per jin?"],
    ["两张多少钱？", "liǎng zhāng duō shao qián?", "How much for two?"],
    ["便宜一点，多少钱？", "pián yi yì diǎn, duō shao qián?", "A bit cheaper — how much?"],
    ["太贵了，多少钱可以？", "tài guì le, duō shao qián kě yǐ?", "Too expensive — what price works?"],
    ["请问，这个多少钱？", "qǐng wèn, zhè ge duō shao qián?", "Excuse me, how much is this?"],
  ],
  太贵了: [
    ["有点贵", "yǒu diǎn guì", "A bit expensive"],
    ["太贵了，便宜一点", "tài guì le, pián yi yì diǎn", "Too expensive — a bit cheaper"],
    ["太贵了，还有别的吗？", "tài guì le, hái yǒu bié de ma?", "Too expensive — anything else?"],
    ["对我来说太贵了", "duì wǒ lái shuō tài guì le", "That's too expensive for me"],
    ["能不能便宜一点？太贵了", "néng bu néng pián yi yì diǎn? tài guì le", "Can it be cheaper? Too expensive"],
    ["这个价太贵了", "zhè ge jià tài guì le", "This price is too high"],
    ["不好意思，太贵了", "bù hǎo yì si, tài guì le", "Sorry — that's too expensive"],
  ],
  打车: [
    ["我想打车", "wǒ xiǎng dǎ chē", "I'd like to take a taxi"],
    ["怎么打车？", "zěn me dǎ chē?", "How do I get a taxi?"],
    ["在哪里打车？", "zài nǎ lǐ dǎ chē?", "Where can I get a taxi?"],
    ["帮我打车", "bāng wǒ dǎ chē", "Please help me get a taxi"],
    ["现在打车方便吗？", "xiàn zài dǎ chē fāng biàn ma?", "Is it easy to get a taxi now?"],
    ["打车去酒店", "dǎ chē qù jiǔ diàn", "Take a taxi to the hotel"],
    ["我用手机打车", "wǒ yòng shǒu jī dǎ chē", "I'll hail a taxi on my phone"],
    ["打车要多久？", "dǎ chē yào duō jiǔ?", "How long by taxi?"],
  ],
  "我有预订": [
    ["你好，我有预订", "nǐ hǎo, wǒ yǒu yù dìng", "Hello, I have a reservation"],
    ["我用护照预订的", "wǒ yòng hù zhào yù dìng de", "I booked with my passport"],
    ["我有今晚的预订", "wǒ yǒu jīn wǎn de yù dìng", "I have a reservation for tonight"],
    ["预订名字是……", "yù dìng míng zi shì…", "The reservation name is…"],
    ["请帮我查一下预订", "qǐng bāng wǒ chá yí xià yù dìng", "Please check my reservation"],
    ["我线上预订的", "wǒ xiàn shàng yù dìng de", "I booked online"],
    ["确认一下，我有预订", "què rèn yí xià, wǒ yǒu yù dìng", "Just to confirm — I have a booking"],
  ],
  "有英文菜单吗？": [
    ["请问，有英文菜单吗？", "qǐng wèn, yǒu yīng wén cài dān ma?", "Excuse me, do you have an English menu?"],
    ["可以看一下菜单吗？", "kě yǐ kàn yí xià cài dān ma?", "May I see the menu?"],
    ["有图片菜单吗？", "yǒu tú piàn cài dān ma?", "Do you have a picture menu?"],
    ["菜单可以扫码吗？", "cài dān kě yǐ sǎo mǎ ma?", "Can I scan a QR menu?"],
    ["没有英文菜单也没关系", "méi yǒu yīng wén cài dān yě méi guān xi", "No English menu is okay too"],
    ["请指一下菜单上的菜", "qǐng zhǐ yí xià cài dān shàng de cài", "Please point to a dish on the menu"],
    ["我想看菜单", "wǒ xiǎng kàn cài dān", "I'd like to see the menu"],
  ],
  "可以扫码支付吗？": [
    ["我用微信扫码支付", "wǒ yòng wēi xìn sǎo mǎ zhī fù", "I'll pay by WeChat QR"],
    ["支付宝可以扫码吗？", "zhī fù bǎo kě yǐ sǎo mǎ ma?", "Can I pay with Alipay QR?"],
    ["只收现金吗？还可以扫码吗？", "zhǐ shōu xiàn jīn ma? hái kě yǐ sǎo mǎ ma?", "Cash only, or scan to pay?"],
    ["我扫你还是你扫我？", "wǒ sǎo nǐ hái shì nǐ sǎo wǒ?", "Do I scan you, or you scan me?"],
    ["付款码在这里", "fù kuǎn mǎ zài zhè lǐ", "Here's my payment code"],
    ["扫码失败了", "sǎo mǎ shī bài le", "The scan/payment failed"],
    ["可以再扫一次吗？", "kě yǐ zài sǎo yí cì ma?", "Can we scan again?"],
    ["外国人可以扫码支付吗？", "wài guó rén kě yǐ sǎo mǎ zhī fù ma?", "Can foreigners pay by QR?"],
  ],
  "请问怎么走？": [
    ["请问，地铁站怎么走？", "qǐng wèn, dì tiě zhàn zěn me zǒu?", "Excuse me, how do I get to the subway?"],
    ["去酒店怎么走？", "qù jiǔ diàn zěn me zǒu?", "How do I get to the hotel?"],
    ["请问，洗手间怎么走？", "qǐng wèn, xǐ shǒu jiān zěn me zǒu?", "Excuse me, how do I get to the restroom?"],
    ["从这里怎么走？", "cóng zhè lǐ zěn me zǒu?", "How do I go from here?"],
    ["走路怎么走？", "zǒu lù zěn me zǒu?", "How do I walk there?"],
    ["坐地铁怎么走？", "zuò dì tiě zěn me zǒu?", "How do I get there by subway?"],
    ["最近的出口怎么走？", "zuì jìn de chū kǒu zěn me zǒu?", "How do I get to the nearest exit?"],
  ],
  "我要买火车票": [
    ["我想买一张去北京的火车票", "wǒ xiǎng mǎi yì zhāng qù běi jīng de huǒ chē piào", "I'd like a train ticket to Beijing"],
    ["有今天下午的票吗？", "yǒu jīn tiān xià wǔ de piào ma?", "Any tickets this afternoon?"],
    ["我要两张火车票", "wǒ yào liǎng zhāng huǒ chē piào", "I want two train tickets"],
    ["火车票怎么买？", "huǒ chē piào zěn me mǎi?", "How do I buy train tickets?"],
    ["可以网上买火车票吗？", "kě yǐ wǎng shàng mǎi huǒ chē piào ma?", "Can I buy train tickets online?"],
    ["我要高铁票，不是普通火车", "wǒ yào gāo tiě piào, bú shì pǔ tōng huǒ chē", "I want high-speed rail, not a regular train"],
    ["用护照买火车票", "yòng hù zhào mǎi huǒ chē piào", "Buy a train ticket with a passport"],
  ],
  "门票多少钱？": [
    ["成人门票多少钱？", "chéng rén mén piào duō shao qián?", "How much is an adult ticket?"],
    ["两张门票多少钱？", "liǎng zhāng mén piào duō shao qián?", "How much for two tickets?"],
    ["学生门票多少钱？", "xué shēng mén piào duō shao qián?", "How much is a student ticket?"],
    ["儿童门票多少钱？", "ér tóng mén piào duō shao qián?", "How much is a child ticket?"],
    ["套票多少钱？", "tào piào duō shao qián?", "How much is the combo ticket?"],
    ["网上订门票多少钱？", "wǎng shàng dìng mén piào duō shao qián?", "How much if I book online?"],
    ["请问，门票多少钱？", "qǐng wèn, mén piào duō shao qián?", "Excuse me, how much is admission?"],
  ],
  "救命！": [
    ["请帮帮我！", "qǐng bāng bang wǒ!", "Please help me!"],
    ["快来人！救命！", "kuài lái rén! jiù mìng!", "Someone help! Help!"],
    ["救命，我需要帮助！", "jiù mìng, wǒ xū yào bāng zhù!", "Help — I need assistance!"],
    ["请叫警察！救命！", "qǐng jiào jǐng chá! jiù mìng!", "Call the police! Help!"],
    ["救命，有人受伤了！", "jiù mìng, yǒu rén shòu shāng le!", "Help — someone is hurt!"],
    ["这里出事了，救命！", "zhè lǐ chū shì le, jiù mìng!", "Something happened here — help!"],
    ["救命！我迷路了！", "jiù mìng! wǒ mí lù le!", "Help! I'm lost!"],
  ],
  "你好吗？": [
    ["您好吗？", "nín hǎo ma?", "How are you? (polite)"],
    ["我很好，你呢？", "wǒ hěn hǎo, nǐ ne?", "I'm fine, and you?"],
    ["最近好吗？", "zuì jìn hǎo ma?", "How have you been lately?"],
    ["今天怎么样？", "jīn tiān zěn me yàng?", "How's it going today?"],
    ["你好吗？我很好", "nǐ hǎo ma? wǒ hěn hǎo", "How are you? I'm fine"],
    ["还好吗？", "hái hǎo ma?", "Are you doing okay?"],
    ["忙吗？你好吗？", "máng ma? nǐ hǎo ma?", "Busy? How are you?"],
  ],
};

/**
 * @param {[string, string, string]} row
 */
function toItem(row) {
  return { zh: row[0], pinyin: row[1], en: row[2] };
}

/**
 * Generic drills that work for most head phrases.
 * @param {string} zh
 * @param {string} pinyin
 * @param {string} en
 */
function genericDrills(zh, pinyin, en) {
  const bare = zh.replace(/[？?！!。…]+$/g, "").trim();
  const barePy = pinyin.replace(/[?]+$/g, "").trim();
  const bareEn = en.replace(/[?]+$/g, "").trim();
  const isQuestion = /[？?]$/.test(zh);
  const q = isQuestion ? zh : `${bare}？`;
  const qPy = /[?]$/.test(pinyin) ? pinyin : `${barePy}?`;

  /** @type {{ zh: string, pinyin: string, en: string }[]} */
  const items = [];

  if (!bare.startsWith("请问")) {
    if (isQuestion) {
      items.push({
        zh: `请问，${q}`,
        pinyin: `qǐng wèn, ${qPy}`,
        en: `Excuse me — ${en}`,
      });
    } else {
      items.push({
        zh: `请问，可以说“${bare}”吗？`,
        pinyin: `qǐng wèn, kě yǐ shuō “${barePy}” ma?`,
        en: `Excuse me, can I say “${bareEn}”?`,
      });
    }
  }

  items.push(
    {
      zh: `用中文说：${bare}`,
      pinyin: `yòng zhōng wén shuō: ${barePy}`,
      en: `Say in Chinese: “${bareEn}”`,
    },
    {
      zh: `${bare}，谢谢`,
      pinyin: `${barePy}, xiè xie`,
      en: `${bareEn}, thank you`,
    },
    {
      zh: `我会说“${bare}”`,
      pinyin: `wǒ huì shuō “${barePy}”`,
      en: `I can say “${bareEn}”`,
    },
    {
      zh: `请慢一点说：${bare}`,
      pinyin: `qǐng màn yì diǎn shuō: ${barePy}`,
      en: `Please say it slowly: “${bareEn}”`,
    },
    {
      zh: `再说一遍：${bare}`,
      pinyin: `zài shuō yí biàn: ${barePy}`,
      en: `Say it again: “${bareEn}”`,
    },
    {
      zh: `跟我读：${bare}`,
      pinyin: `gēn wǒ dú: ${barePy}`,
      en: `Repeat after me: “${bareEn}”`,
    },
    {
      zh: `这个怎么说？— ${bare}`,
      pinyin: `zhè ge zěn me shuō? — ${barePy}`,
      en: `How do you say this? — “${bareEn}”`,
    },
    {
      zh: `对，就是“${bare}”`,
      pinyin: `duì, jiù shì “${barePy}”`,
      en: `Yes — it's “${bareEn}”`,
    },
    {
      zh: `记住这个说法：${bare}`,
      pinyin: `jì zhù zhè ge shuō fǎ: ${barePy}`,
      en: `Remember this phrase: “${bareEn}”`,
    },
  );

  return items;
}

/**
 * @param {string} zh
 * @param {string} pinyin
 * @param {string} en
 * @returns {{ zh: string, pinyin: string, en: string }[]}
 */
export function buildPractice(zh, pinyin, en) {
  /** @type {{ zh: string, pinyin: string, en: string }[]} */
  const curated = OVERRIDES[zh] ? OVERRIDES[zh].map(toItem) : [];

  // Enough hand-written drills: prefer quality over padding.
  if (curated.length >= TARGET_MIN) {
    return curated.slice(0, TARGET_MAX);
  }

  const bare = zh.replace(/[？?！!。…]+$/g, "").trim();
  const generated = genericDrills(zh, pinyin, en).filter((item) => {
    if (!item.zh || item.zh === zh) return false;
    // Drop awkward echoes like “你好，你好”
    if (item.zh === `${bare}，${bare}` || item.zh === `你好，${bare}` && bare === "你好") {
      return false;
    }
    if (item.zh.includes(`${bare}，${bare}`)) return false;
    return true;
  });

  const seen = new Set([zh]);
  /** @type {{ zh: string, pinyin: string, en: string }[]} */
  const merged = [];

  for (const item of [...curated, ...generated]) {
    if (seen.has(item.zh)) continue;
    seen.add(item.zh);
    merged.push(item);
    if (merged.length >= TARGET_MAX) break;
  }

  return merged.slice(0, TARGET_MAX);
}
