// More English content. Loaded after en.js and appended to the same banks.
// First option of every multiple-choice item is correct (shuffled at runtime).
(() => {
  const B = BANK.en;
  const add = (kind, lvl, items) => B[kind][lvl].push(...items);

  add('placement', 'A1', [
    { q: 'They ___ happy today.', o: ['are', 'is', 'am', 'be'], e: 'مع they نستخدم are.' },
    { q: 'My brother ___ two cars.', o: ['has', 'have', 'haves', 'having'], e: 'مع my brother (he) نستخدم has.' },
    { q: '___ you like tea?', o: ['Do', 'Does', 'Are', 'Is'], e: 'مع you نستخدم Do في السؤال.' },
    { q: 'This is ___ apple.', o: ['an', 'a', 'the a', 'any'], e: 'قبل حرف علة نستخدم an.' },
    { q: 'We ___ at home now.', o: ['are', 'is', 'am', 'be'], e: 'مع we نستخدم are.' },
    { q: 'She ___ not here today.', o: ['is', 'are', 'am', 'do'], e: 'مع she نستخدم is.' },
  ]);
  add('placement', 'A2', [
    { q: 'I ___ playing football when it started to rain.', o: ['was', 'am', 'were', 'have'], e: 'ماضي مستمر مع I: was playing.' },
    { q: 'If you study, you ___ pass the exam.', o: ['will', 'would', 'did', 'are'], e: 'الشرط الأول: if + مضارع، will + فعل.' },
    { q: 'There ___ some milk in the fridge.', o: ['is', 'are', 'were', 'be'], e: 'milk غير معدود فنستخدم is.' },
    { q: 'He is ___ than his brother.', o: ['older', 'oldest', 'more old', 'old'], e: 'صيغة المقارنة: older.' },
    { q: "I'm going ___ the cinema tonight.", o: ['to', 'at', 'in', 'on'], e: 'مع going نستخدم to للمكان.' },
    { q: 'You ___ wear a seatbelt. It is the law.', o: ['must', 'may', "can't", 'might'], e: 'must للإلزام.' },
  ]);
  add('placement', 'B1', [
    { q: 'By the time we arrived, the film ___.', o: ['had started', 'started', 'has started', 'was start'], e: 'ماضي تام لحدث سبق حدثًا آخر.' },
    { q: 'She is looking forward ___ you.', o: ['to seeing', 'to see', 'seeing', 'for see'], e: 'look forward to + اسم فعل (ing).' },
    { q: "I'd rather ___ at home tonight.", o: ['stay', 'to stay', 'staying', 'stayed'], e: "would rather + فعل بدون to." },
    { q: 'He said he ___ call me later.', o: ['would', 'will', 'is', 'does'], e: 'الكلام المنقول: will تصبح would.' },
    { q: 'The more you practise, ___ you get.', o: ['the better', 'better', 'the best', 'more good'], e: 'the more ..., the better ...' },
    { q: 'Despite ___ tired, she finished the work.', o: ['being', 'be', 'she was', 'is'], e: 'despite + اسم فعل (ing).' },
  ]);
  add('placement', 'B2', [
    { q: 'No sooner ___ sat down than the phone rang.', o: ['had he', 'he had', 'did he', 'he has'], e: 'بعد No sooner نقلب الفاعل والفعل المساعد.' },
    { q: 'I regret ___ you earlier.', o: ['not telling', 'not to tell', 'to not tell', "didn't telling"], e: 'regret + ing للندم على أمر ماضٍ.' },
    { q: 'She insisted on ___ for the meal.', o: ['paying', 'to pay', 'pay', 'paid'], e: 'insist on + اسم فعل (ing).' },
    { q: 'Had it not been for your help, I ___ failed.', o: ['would have', 'will have', 'would', 'had'], e: 'الشرط الثالث بصيغة معكوسة.' },
    { q: 'He is said ___ the richest man in town.', o: ['to be', 'being', 'to being', 'that be'], e: 'is said to be = يُقال إنه.' },
    { q: 'It is high time we ___ a decision.', o: ['made', 'make', 'will make', 'have make'], e: 'It is high time + ماضي بسيط.' },
  ]);

  add('stories', 'A1', [
    {
      id: 'en-a1-4', t: 'At the Cafe',
      x: 'Omar and Lina are at a cafe. Omar orders a coffee and a sandwich. Lina orders a tea. The waiter brings the drinks. The coffee is hot. Lina pays.',
      ar: 'عمر ولينا في مقهى. يطلب عمر قهوة وساندويتش. تطلب لينا شايًا. يحضر النادل المشروبات. القهوة ساخنة. تدفع لينا.',
      v: [['cafe', 'مقهى'], ['orders', 'يطلب'], ['sandwich', 'ساندويتش'], ['waiter', 'نادل'], ['drinks', 'مشروبات'], ['hot', 'ساخن'], ['pays', 'يدفع']],
      qs: [
        { q: 'Where are Omar and Lina?', o: ['At a cafe', 'At school', 'At home', 'At the market'] },
        { q: 'What does Omar order?', o: ['A coffee and a sandwich', 'A tea', 'A pizza', 'Water'] },
        { q: 'Who brings the drinks?', o: ['The waiter', 'Lina', 'Omar', 'The cook'] },
        { q: 'Who pays?', o: ['Lina', 'Omar', 'The waiter', 'Nobody'] },
      ],
    },
    {
      id: 'en-a1-5', t: 'My Room',
      x: 'My room is small but nice. There is a bed, a desk and a chair. There is a window next to the desk. I have a lamp and many books. I like my room.',
      ar: 'غرفتي صغيرة لكنها جميلة. فيها سرير ومكتب وكرسي. هناك نافذة بجانب المكتب. عندي مصباح وكتب كثيرة. أحب غرفتي.',
      v: [['room', 'غرفة'], ['bed', 'سرير'], ['desk', 'مكتب'], ['chair', 'كرسي'], ['window', 'نافذة'], ['lamp', 'مصباح'], ['books', 'كتب']],
      qs: [
        { q: 'How is the room?', o: ['Small but nice', 'Big and dark', 'Old and dirty', 'Cold'] },
        { q: 'What is next to the desk?', o: ['A window', 'A door', 'A bed', 'A sofa'] },
        { q: 'What does the speaker have?', o: ['A lamp and many books', 'A television', 'A computer only', 'A piano'] },
        { q: 'Does the speaker like the room?', o: ['Yes', 'No', 'Not really', 'We do not know'] },
      ],
    },
    {
      id: 'en-a1-6', t: 'The Weather',
      x: 'Yesterday it was sunny. Today it is cold and rainy. I wear a coat and boots. I take an umbrella to work. In the evening I drink hot tea at home.',
      ar: 'أمس كان الجو مشمسًا. اليوم بارد وماطر. أرتدي معطفًا وحذاءً طويلًا. آخذ مظلة إلى العمل. في المساء أشرب شايًا ساخنًا في البيت.',
      v: [['sunny', 'مشمس'], ['cold', 'بارد'], ['rainy', 'ماطر'], ['coat', 'معطف'], ['boots', 'أحذية طويلة'], ['umbrella', 'مظلة'], ['tea', 'شاي']],
      qs: [
        { q: 'What was the weather yesterday?', o: ['Sunny', 'Rainy', 'Snowy', 'Windy'] },
        { q: 'What is the weather today?', o: ['Cold and rainy', 'Hot and sunny', 'Warm and dry', 'Snowy'] },
        { q: 'What does the speaker take to work?', o: ['An umbrella', 'A bike', 'A hat', 'A bag of food'] },
        { q: 'What does the speaker drink in the evening?', o: ['Hot tea', 'Cold juice', 'Coffee', 'Milk'] },
      ],
    },
    {
      id: 'en-a1-7', t: 'Going to School',
      x: 'Amir is eight. He goes to school at eight o\'clock. He walks with his friend Leo. At school he reads, writes and plays. He eats lunch at twelve. He goes home at three.',
      ar: 'أمير عمره ثماني سنوات. يذهب إلى المدرسة في الثامنة. يمشي مع صديقه ليو. في المدرسة يقرأ ويكتب ويلعب. يتناول الغداء في الثانية عشرة. يعود إلى البيت في الثالثة.',
      v: [['school', 'مدرسة'], ['walks', 'يمشي'], ['friend', 'صديق'], ['reads', 'يقرأ'], ['writes', 'يكتب'], ['lunch', 'غداء'], ['home', 'البيت']],
      qs: [
        { q: 'How old is Amir?', o: ['Eight', 'Ten', 'Six', 'Twelve'] },
        { q: 'Who does Amir walk with?', o: ['His friend Leo', 'His mother', 'His teacher', 'Alone'] },
        { q: 'What time does he eat lunch?', o: ['At twelve', 'At one', 'At eleven', 'At three'] },
        { q: 'When does he go home?', o: ['At three', 'At five', 'At noon', 'At eight'] },
      ],
    },
  ]);

  add('stories', 'A2', [
    {
      id: 'en-a2-5', t: 'At the Bank',
      x: 'Maya wants to open a bank account. She goes to the bank with her passport and a document with her address. A clerk gives her a form and explains the monthly fees. Maya reads the form carefully before she signs. The clerk says her card will arrive in a week.',
      ar: 'تريد مايا فتح حساب مصرفي. تذهب إلى المصرف مع جواز سفرها ووثيقة فيها عنوانها. يعطيها الموظف استمارة ويشرح الرسوم الشهرية. تقرأ مايا الاستمارة بعناية قبل أن توقّع. يقول الموظف إن بطاقتها ستصل خلال أسبوع.',
      v: [['account', 'حساب'], ['passport', 'جواز سفر'], ['clerk', 'موظف'], ['form', 'استمارة'], ['fees', 'رسوم'], ['carefully', 'بعناية'], ['signs', 'توقّع']],
      qs: [
        { q: 'What does Maya want to do?', o: ['Open a bank account', 'Get a loan', 'Buy a house', 'Change her job'] },
        { q: 'What does she bring to the bank?', o: ['Her passport and a document with her address', 'Her phone', 'Her employer', 'A friend'] },
        { q: 'What does the clerk explain?', o: ['The monthly fees', 'The weather', 'The bus times', 'The price of food'] },
        { q: 'What does Maya do before she signs?', o: ['Reads the form carefully', 'Asks her friend', 'Leaves', 'Calls her boss'] },
      ],
    },
    {
      id: 'en-a2-6', t: 'A Birthday Surprise',
      x: "Last Saturday was Sam's birthday. His friends planned a surprise party at their flat. They bought a cake, balloons and a small gift. When Sam came home, everyone shouted 'Surprise!' Sam was very happy. They ate cake and danced until midnight.",
      ar: 'السبت الماضي كان عيد ميلاد سام. خطّط أصدقاؤه لحفلة مفاجأة في شقتهم. اشتروا كعكة وبالونات وهدية صغيرة. عندما عاد سام إلى البيت صاح الجميع: «مفاجأة!». كان سام سعيدًا جدًا. أكلوا الكعكة ورقصوا حتى منتصف الليل.',
      v: [['birthday', 'عيد ميلاد'], ['planned', 'خطّطوا'], ['surprise', 'مفاجأة'], ['balloons', 'بالونات'], ['gift', 'هدية'], ['shouted', 'صاحوا'], ['midnight', 'منتصف الليل']],
      qs: [
        { q: 'Whose birthday was it?', o: ["Sam's", "Leo's", "Maya's", "The teacher's"] },
        { q: 'What did the friends buy?', o: ['A cake, balloons and a small gift', 'Flowers only', 'A car', 'Tickets'] },
        { q: 'What did everyone shout?', o: ['Surprise!', 'Happy New Year!', 'Goodbye!', 'Welcome!'] },
        { q: 'How long did they dance?', o: ['Until midnight', 'Until morning', 'For ten minutes', 'They did not dance'] },
      ],
    },
    {
      id: 'en-a2-7', t: 'The Wrong Bus',
      x: 'Karim took the wrong bus this morning. He wanted to go to the hospital, but the bus went to the airport. He asked the driver for help. The driver explained that he needed to change buses at the next stop. Karim waited fifteen minutes and finally arrived late, but he was not angry.',
      ar: 'ركب كريم الحافلة الخطأ هذا الصباح. كان يريد الذهاب إلى المستشفى لكن الحافلة ذهبت إلى المطار. طلب المساعدة من السائق. شرح السائق أنه يجب أن يغيّر الحافلة عند الموقف التالي. انتظر كريم خمس عشرة دقيقة ووصل أخيرًا متأخرًا لكنه لم يكن غاضبًا.',
      v: [['wrong', 'خطأ'], ['hospital', 'مستشفى'], ['airport', 'مطار'], ['driver', 'سائق'], ['explained', 'شرح'], ['stop', 'موقف'], ['angry', 'غاضب']],
      qs: [
        { q: 'Where did Karim want to go?', o: ['To the hospital', 'To the airport', 'To school', 'To work'] },
        { q: 'Where did the bus go?', o: ['To the airport', 'To the hospital', 'To the station', 'To the park'] },
        { q: 'What did the driver say?', o: ['Change buses at the next stop', 'Get off now', 'Take a taxi', 'Go home'] },
        { q: 'How did Karim feel at the end?', o: ['Not angry', 'Very angry', 'Sad', 'Afraid'] },
      ],
    },
    {
      id: 'en-a2-8', t: 'Online Shopping',
      x: 'Nina ordered a jacket online. It arrived after four days, but it was too small. She read the return policy and found that she could send it back within fourteen days. She filled in a form, put the jacket in the box and took it to the post office. A week later, she received her money back.',
      ar: 'طلبت نينا سترة عبر الإنترنت. وصلت بعد أربعة أيام لكنها كانت صغيرة جدًا. قرأت سياسة الإرجاع ووجدت أنها تستطيع إعادتها خلال أربعة عشر يومًا. ملأت استمارة ووضعت السترة في الصندوق وأخذتها إلى مكتب البريد. بعد أسبوع استلمت أموالها.',
      v: [['jacket', 'سترة'], ['online', 'عبر الإنترنت'], ['arrived', 'وصلت'], ['return', 'إرجاع'], ['policy', 'سياسة'], ['form', 'استمارة'], ['money', 'مال']],
      qs: [
        { q: 'What did Nina order?', o: ['A jacket', 'A phone', 'Shoes', 'A book'] },
        { q: 'What was the problem?', o: ['It was too small', 'It was too expensive', 'It was dirty', 'It never arrived'] },
        { q: 'How long could she send it back?', o: ['Within fourteen days', 'Within one day', 'Within a year', 'She could not'] },
        { q: 'What happened a week later?', o: ['She received her money back', 'She got a new jacket', 'She lost the box', 'Nothing'] },
      ],
    },
    {
      id: 'en-a2-9', t: 'A Busy Week',
      x: 'Dan has a busy week. On Monday he has a meeting at nine. On Tuesday he goes to the dentist after work. On Wednesday he plays football with his friends. On Thursday he must finish an important report. On Friday he is going to rest at home and watch a film.',
      ar: 'أسبوع دان مزدحم. يوم الاثنين عنده اجتماع في التاسعة. يوم الثلاثاء يذهب إلى طبيب الأسنان بعد العمل. يوم الأربعاء يلعب كرة القدم مع أصدقائه. يوم الخميس عليه أن ينهي تقريرًا مهمًا. يوم الجمعة سيرتاح في البيت ويشاهد فيلمًا.',
      v: [['busy', 'مزدحم / مشغول'], ['meeting', 'اجتماع'], ['dentist', 'طبيب أسنان'], ['football', 'كرة القدم'], ['report', 'تقرير'], ['important', 'مهم'], ['rest', 'يرتاح']],
      qs: [
        { q: 'What does Dan have on Monday?', o: ['A meeting at nine', 'A dentist appointment', 'A football match', 'A film'] },
        { q: 'When does he go to the dentist?', o: ['On Tuesday after work', 'On Monday', 'On Friday', 'On Wednesday'] },
        { q: 'What must he finish on Thursday?', o: ['An important report', 'A book', 'A film', 'A game'] },
        { q: 'What is he going to do on Friday?', o: ['Rest and watch a film', 'Go to work', 'Play football', 'Visit the dentist'] },
      ],
    },
  ]);

  add('stories', 'B1', [
    {
      id: 'en-b1-5', t: 'Moving to a New City',
      x: 'When Lucia moved to a new city, she knew nobody. She found a small flat near the station and started working at a pharmacy. The first weeks were lonely, so she decided to join a language class in the evenings. There she met several people in the same situation. They began to meet at weekends to explore the city together. Within a few months, Lucia felt that the place had stopped being strange and had started to feel like home.',
      ar: 'عندما انتقلت لوسيا إلى مدينة جديدة لم تكن تعرف أحدًا. وجدت شقة صغيرة قرب المحطة وبدأت تعمل في صيدلية. كانت الأسابيع الأولى وحيدة، فقرّرت أن تنضم إلى صف لغة في المساء. هناك التقت عدة أشخاص في الوضع نفسه. بدأوا يلتقون في عطل نهاية الأسبوع لاستكشاف المدينة معًا. خلال بضعة أشهر شعرت لوسيا أن المكان لم يعد غريبًا وبدأ يبدو كالبيت.',
      v: [['moved', 'انتقلت'], ['pharmacy', 'صيدلية'], ['lonely', 'وحيد'], ['language', 'لغة'], ['situation', 'وضع'], ['explore', 'يستكشف'], ['strange', 'غريب']],
      qs: [
        { q: 'Where did Lucia find a flat?', o: ['Near the station', 'Near the sea', 'In the mountains', 'Next to her office'] },
        { q: 'Why did she join a language class?', o: ['The first weeks were lonely', 'She wanted a new job', 'It was free', 'Her boss asked her'] },
        { q: 'What did the group start to do at weekends?', o: ['Explore the city together', 'Study grammar', 'Work extra hours', 'Travel abroad'] },
        { q: 'How did Lucia feel after a few months?', o: ['The place felt like home', 'She wanted to leave', 'She felt more lonely', 'She was bored'] },
      ],
    },
    {
      id: 'en-b1-6', t: 'A Misunderstanding at Work',
      x: 'Last week, Ahmed misunderstood an instruction from his manager and prepared the wrong documents. Instead of hiding the mistake, he told his manager immediately and apologised. The manager appreciated his honesty and explained the instruction again more clearly. Ahmed now asks questions whenever something is unclear and writes notes during meetings.',
      ar: 'الأسبوع الماضي أساء أحمد فهم تعليمات من مديره وجهّز الوثائق الخطأ. بدل أن يخفي الخطأ أخبر مديره فورًا واعتذر. قدّر المدير صراحته وشرح التعليمات مرة أخرى بوضوح أكثر. أحمد الآن يطرح أسئلة كلما كان شيء غير واضح ويكتب ملاحظات أثناء الاجتماعات.',
      v: [['misunderstood', 'أساء الفهم'], ['instruction', 'تعليمات'], ['documents', 'وثائق'], ['hiding', 'يخفي'], ['apologised', 'اعتذر'], ['honesty', 'صدق / صراحة'], ['unclear', 'غير واضح']],
      qs: [
        { q: 'What did Ahmed prepare by mistake?', o: ['The wrong documents', 'The wrong report', 'A wrong email', 'Nothing'] },
        { q: 'What did he do after he found the mistake?', o: ['Told his manager and apologised', 'Hid it', 'Blamed a colleague', 'Left work'] },
        { q: 'How did the manager react?', o: ['He appreciated his honesty', 'He was furious', 'He fired Ahmed', 'He ignored it'] },
        { q: 'What does Ahmed do now?', o: ['Asks questions and writes notes', 'Avoids meetings', 'Works alone', 'Records conversations'] },
      ],
    },
    {
      id: 'en-b1-7', t: 'The Power of Routine',
      x: "Nadia used to study English only when she felt motivated, which meant she often didn't study at all. After reading about habits, she decided to study for fifteen minutes straight after breakfast every day. At first it felt too short to matter, but after three months she noticed that she could follow a TV series without subtitles for the first time.",
      ar: 'كانت ناديا تدرس الإنجليزية فقط عندما تشعر بالحماس، وهذا يعني أنها كثيرًا ما لا تدرس إطلاقًا. بعد أن قرأت عن العادات قرّرت أن تدرس خمس عشرة دقيقة مباشرة بعد الفطور كل يوم. في البداية بدا الوقت أقصر من أن يُحدث فرقًا، لكن بعد ثلاثة أشهر لاحظت أنها تستطيع متابعة مسلسل بدون ترجمة لأول مرة.',
      v: [['motivated', 'متحمّس'], ['habits', 'عادات'], ['decided', 'قرّرت'], ['fifteen', 'خمس عشرة'], ['matter', 'يهم / يُحدث فرقًا'], ['noticed', 'لاحظت'], ['subtitles', 'ترجمة نصية']],
      qs: [
        { q: 'When did Nadia use to study?', o: ['Only when she felt motivated', 'Every day for hours', 'Only at weekends', 'Never'] },
        { q: 'When does she study now?', o: ['Fifteen minutes after breakfast', 'Two hours at night', 'Before bed', 'Only on Sundays'] },
        { q: 'How did the routine feel at first?', o: ['Too short to matter', 'Too long', 'Too difficult', 'Boring'] },
        { q: 'What happened after three months?', o: ['She could follow a TV series without subtitles', 'She passed an exam', 'She stopped studying', 'She changed teacher'] },
      ],
    },
    {
      id: 'en-b1-8', t: 'A Day Without Internet',
      x: "Last Sunday the internet went down in Tom's building. At first he felt anxious because he couldn't check his messages. Then he decided to use the time differently: he cleaned his flat, called his grandmother and went for a long walk. By the evening he felt calmer than he had for weeks, and he promised himself to switch off his phone for an hour every day.",
      ar: 'يوم الأحد الماضي انقطع الإنترنت في بناية توم. في البداية شعر بالقلق لأنه لا يستطيع تفقّد رسائله. ثم قرّر أن يستخدم الوقت بشكل مختلف: نظّف شقته واتصل بجدته وذهب في نزهة طويلة. بحلول المساء شعر بهدوء أكثر مما شعر به منذ أسابيع، ووعد نفسه أن يطفئ هاتفه ساعة كل يوم.',
      v: [['internet', 'إنترنت'], ['anxious', 'قلق'], ['messages', 'رسائل'], ['differently', 'بشكل مختلف'], ['grandmother', 'جدّة'], ['calmer', 'أكثر هدوءًا'], ['promised', 'وعد']],
      qs: [
        { q: 'What happened last Sunday?', o: ["The internet went down in Tom's building", 'Tom lost his phone', 'Tom moved house', 'Tom was ill'] },
        { q: 'Why did he feel anxious at first?', o: ["He couldn't check his messages", 'He was late', 'He lost money', 'He was hungry'] },
        { q: 'What did he do with the time?', o: ['Cleaned, called his grandmother and walked', 'Watched television', 'Slept all day', 'Worked'] },
        { q: 'What did he promise himself?', o: ['To switch off his phone for an hour every day', 'To buy a new phone', 'To stop working', 'To move house'] },
      ],
    },
    {
      id: 'en-b1-9', t: 'Volunteering at a Food Bank',
      x: 'Sara has been volunteering at a local food bank every Saturday for six months. She sorts donations, packs boxes and talks to the families who come. At first she was shy, but now she greets everyone by name. She says the experience has taught her patience and made her feel part of the community.',
      ar: 'سارة تتطوع في بنك طعام محلي كل سبت منذ ستة أشهر. تفرز التبرعات وتعبّئ الصناديق وتتحدث إلى العائلات التي تأتي. في البداية كانت خجولة لكنها الآن تحيّي الجميع بأسمائهم. تقول إن التجربة علّمتها الصبر وجعلتها تشعر أنها جزء من المجتمع.',
      v: [['volunteering', 'تطوّع'], ['donations', 'تبرعات'], ['packs', 'تعبّئ'], ['families', 'عائلات'], ['shy', 'خجول'], ['patience', 'صبر'], ['community', 'مجتمع']],
      qs: [
        { q: 'How often does Sara volunteer?', o: ['Every Saturday', 'Every day', 'Once a month', 'Every Sunday'] },
        { q: 'What does she do there?', o: ['Sorts donations and packs boxes', 'Cooks meals', 'Drives trucks', 'Teaches children'] },
        { q: 'How was she at first?', o: ['Shy', 'Confident', 'Angry', 'Bored'] },
        { q: 'What has the experience taught her?', o: ['Patience', 'How to cook', 'A new language', 'How to drive'] },
      ],
    },
  ]);

  add('stories', 'B2', [
    {
      id: 'en-b2-4', t: 'The Gig Economy',
      x: 'In recent years, more workers have taken up freelance jobs delivered through digital platforms. Supporters argue that this offers flexibility and independence, allowing people to choose when and how much they work. Critics, however, point out that such workers often lack paid holidays, sick pay and job security. As the debate continues, some governments are considering new rules to protect them without removing the flexibility that makes these jobs attractive.',
      ar: 'في السنوات الأخيرة اتجه مزيد من العمال إلى وظائف حرة تُقدَّم عبر منصات رقمية. يرى المؤيدون أن ذلك يمنح مرونة واستقلالية ويتيح للناس اختيار وقت العمل ومقداره. أما المنتقدون فيشيرون إلى أن هؤلاء العمال غالبًا يفتقرون إلى الإجازات المدفوعة والأجر المرضي والأمان الوظيفي. ومع استمرار النقاش تدرس بعض الحكومات قواعد جديدة لحمايتهم دون إلغاء المرونة التي تجعل هذه الوظائف جذابة.',
      v: [['freelance', 'عمل حر'], ['platforms', 'منصات'], ['flexibility', 'مرونة'], ['independence', 'استقلالية'], ['critics', 'منتقدون'], ['security', 'أمان'], ['attractive', 'جذّاب']],
      qs: [
        { q: 'What do supporters of gig work emphasise?', o: ['Flexibility and independence', 'Higher salaries', 'Longer holidays', 'Job security'] },
        { q: 'What do critics say such workers often lack?', o: ['Paid holidays, sick pay and job security', 'Skills', 'Tools', 'Customers'] },
        { q: 'What are some governments considering?', o: ['New rules to protect these workers', 'Banning the platforms', 'Raising taxes only', 'Nothing'] },
        { q: 'What do the new rules try not to remove?', o: ['The flexibility of the jobs', 'The platforms', 'The workers', 'The taxes'] },
      ],
    },
    {
      id: 'en-b2-5', t: 'Remote Learning',
      x: 'The shift to online education has revealed both opportunities and obstacles. Students with reliable internet and a quiet place to study often thrive, while those without struggle to keep up. Teachers have had to rethink how they hold attention, relying on short activities and frequent feedback. Many experts believe that the most effective approach combines digital tools with face-to-face contact.',
      ar: 'كشف التحوّل إلى التعليم عبر الإنترنت عن فرص وعقبات معًا. الطلاب الذين لديهم إنترنت موثوق ومكان هادئ للدراسة غالبًا ينجحون، بينما يكافح من لا يملكونها ليواكبوا. اضطر المعلمون إلى إعادة التفكير في كيفية جذب الانتباه، معتمدين على أنشطة قصيرة وتغذية راجعة متكررة. يرى كثير من الخبراء أن أنجح نهج هو الجمع بين الأدوات الرقمية والتواصل المباشر.',
      v: [['revealed', 'كشف'], ['obstacles', 'عقبات'], ['reliable', 'موثوق'], ['thrive', 'يزدهر'], ['struggle', 'يكافح'], ['feedback', 'تغذية راجعة'], ['effective', 'فعّال']],
      qs: [
        { q: 'Who often thrives in online learning?', o: ['Students with reliable internet and a quiet place', 'All students equally', 'Only young children', 'Students without computers'] },
        { q: 'How have teachers changed their approach?', o: ['Short activities and frequent feedback', 'Longer lectures', 'Fewer exams', 'No homework'] },
        { q: 'What do many experts believe is most effective?', o: ['Combining digital tools with face-to-face contact', 'Fully online learning', 'No technology', 'Only video lessons'] },
        { q: 'What did the shift reveal?', o: ['Both opportunities and obstacles', 'Only problems', 'Only benefits', 'Nothing new'] },
      ],
    },
    {
      id: 'en-b2-6', t: 'The Cost of Living',
      x: 'Rising rents and food prices have forced many families to reconsider their budgets. Some have moved to cheaper neighbourhoods, while others share flats to split the costs. Financial advisers recommend tracking expenses for a month, as small daily purchases often add up to a surprising amount. Although it can feel discouraging, those who plan carefully usually find they have more control than they expected.',
      ar: 'أجبر ارتفاع الإيجارات وأسعار الغذاء كثيرًا من العائلات على إعادة النظر في ميزانياتها. انتقل بعضها إلى أحياء أرخص، بينما يتشارك آخرون الشقق لتقسيم التكاليف. ينصح المستشارون الماليون بتتبّع النفقات لمدة شهر لأن المشتريات اليومية الصغيرة كثيرًا ما تتراكم لمبلغ مفاجئ. ورغم أن الأمر قد يبدو محبطًا فإن من يخطّطون بعناية يجدون عادةً أن لديهم تحكمًا أكبر مما توقعوا.',
      v: [['rents', 'إيجارات'], ['budgets', 'ميزانيات'], ['neighbourhoods', 'أحياء'], ['split', 'يقسّم'], ['expenses', 'نفقات'], ['purchases', 'مشتريات'], ['discouraging', 'محبط']],
      qs: [
        { q: 'What has forced families to rethink their budgets?', o: ['Rising rents and food prices', 'Lower salaries only', 'New taxes', 'Bad weather'] },
        { q: 'How do some families cut costs?', o: ['By sharing flats', 'By working less', 'By stopping eating out only', 'By selling cars'] },
        { q: 'What do advisers recommend?', o: ['Tracking expenses for a month', 'Borrowing money', 'Avoiding banks', 'Buying in bulk'] },
        { q: 'What do careful planners usually find?', o: ['They have more control than expected', 'They save nothing', 'They must move', 'They spend more'] },
      ],
    },
    {
      id: 'en-b2-7', t: 'Cultural Misunderstandings',
      x: 'When people from different cultures work together, small differences in communication can lead to big misunderstandings. In some countries, direct disagreement is considered honest; in others, it seems rude. Silence can signal respect in one setting and discomfort in another. Learning to ask clarifying questions, rather than assuming, helps teams avoid conflict and builds trust over time.',
      ar: 'عندما يعمل أشخاص من ثقافات مختلفة معًا قد تؤدي فروق صغيرة في التواصل إلى سوء فهم كبير. في بعض البلدان يُعدّ الخلاف المباشر صراحة، وفي أخرى يبدو وقاحة. قد يدل الصمت على الاحترام في سياق وعلى الانزعاج في آخر. تعلّم طرح أسئلة توضيحية بدل الافتراض يساعد الفرق على تجنب الصراع ويبني الثقة مع الوقت.',
      v: [['cultures', 'ثقافات'], ['communication', 'تواصل'], ['misunderstandings', 'سوء فهم'], ['disagreement', 'خلاف'], ['rude', 'وقح'], ['silence', 'صمت'], ['clarifying', 'توضيحي']],
      qs: [
        { q: 'What can small differences in communication cause?', o: ['Big misunderstandings', 'Faster work', 'Better teamwork', 'Nothing'] },
        { q: 'How might direct disagreement be seen in different countries?', o: ['Honest in some, rude in others', 'Always honest', 'Always rude', 'Always ignored'] },
        { q: 'What can silence signal?', o: ['Respect in one setting and discomfort in another', 'Only respect', 'Only anger', 'Agreement always'] },
        { q: 'What helps teams avoid conflict?', o: ['Asking clarifying questions instead of assuming', 'Avoiding discussion', 'Working alone', 'Using only email'] },
      ],
    },
  ]);

  add('writing', 'A1', [
    { p: 'صِف بيتك أو غرفتك.', m: 'My home is small. It has one bedroom and a kitchen. I like my room because it has a big window.' },
  ]);
  add('writing', 'A2', [
    { p: 'اكتب رسالة قصيرة لصديق تدعوه لزيارتك.', m: 'Hi Sam, would you like to visit me this weekend? We can cook dinner and watch a film. Please tell me when you are free. See you soon!' },
  ]);
  add('writing', 'B1', [
    { p: 'اكتب رسالة لصاحب البيت عن عطل في التدفئة.', m: 'Dear Mr Brown, the heating in my flat has not worked for ten days. Could you please send a technician as soon as possible? Thank you. Best regards, Ali.' },
  ]);
  add('writing', 'B2', [
    { p: 'اكتب شكوى مختصرة عن خدمة سيئة تلقيتها.', m: 'I am writing to complain about the service I received last week. Although I explained the problem clearly, nobody contacted me. I would appreciate a prompt reply and a suitable solution.' },
  ]);
})();
