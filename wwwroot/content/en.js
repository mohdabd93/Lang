// English content bank. FIRST option of every multiple-choice item is the correct one (shuffled at runtime).
window.BANK = window.BANK || {};
BANK.en = {
  placement: {
    A1: [
      { q: 'She ___ a student.', o: ['is', 'am', 'are', 'be'], e: 'مع she نستخدم is.' },
      { q: 'I ___ from Syria.', o: ['am', 'is', 'are', 'be'], e: 'مع I نستخدم am.' },
      { q: 'There are three ___ on the table.', o: ['books', 'book', 'a book', 'booking'], e: 'بعد three نستخدم الجمع.' },
      { q: 'My name ___ Ali.', o: ['is', 'are', 'am', 'be'], e: 'My name is ...' },
      { q: 'He ___ coffee every morning.', o: ['drinks', 'drink', 'drinking', 'drunk'], e: 'مع he نضيف s للفعل.' },
      { q: 'Where do you ___?', o: ['live', 'lives', 'living', 'lived'], e: 'بعد do نستخدم الفعل الأصلي.' },
    ],
    A2: [
      { q: 'I ___ to the market yesterday.', o: ['went', 'go', 'going', 'gone'], e: 'yesterday = ماضي بسيط: went.' },
      { q: 'She is taller ___ me.', o: ['than', 'then', 'that', 'as'], e: 'المقارنة تستخدم than.' },
      { q: 'We ___ dinner when he called.', o: ['were having', 'have', 'are having', 'had have'], e: 'ماضي مستمر لحدث كان جاريًا.' },
      { q: 'How much ___ it cost?', o: ['does', 'do', 'is', 'are'], e: 'مع it نستخدم does في السؤال.' },
      { q: "I haven't seen him ___ Monday.", o: ['since', 'for', 'from', 'at'], e: 'since مع نقطة زمنية محددة.' },
      { q: 'If it rains, we ___ at home.', o: ['will stay', 'stayed', 'would stay', 'staying'], e: 'الشرط الأول: if + مضارع، will + فعل.' },
    ],
    B1: [
      { q: 'I wish I ___ more time.', o: ['had', 'have', 'will have', 'having'], e: 'wish + ماضي للتمنّي في الحاضر.' },
      { q: 'The report ___ by the manager yesterday.', o: ['was written', 'wrote', 'is writing', 'has wrote'], e: 'المبني للمجهول في الماضي: was written.' },
      { q: 'He asked me where ___.', o: ['I lived', 'did I live', 'do I live', 'I do live'], e: 'السؤال غير المباشر يحافظ على ترتيب الجملة الخبرية.' },
      { q: "You ___ smoke here. It's forbidden.", o: ["mustn't", "don't have to", "needn't", "shouldn't to"], e: "mustn't = ممنوع." },
      { q: "I'm used to ___ up early.", o: ['getting', 'get', 'got', 'gets'], e: 'be used to + اسم فعل (ing).' },
      { q: 'She suggested ___ a taxi.', o: ['taking', 'to take', 'take', 'took'], e: 'suggest + اسم فعل (ing).' },
    ],
    B2: [
      { q: 'Had I known, I ___ differently.', o: ['would have acted', 'would act', 'will act', 'acted'], e: 'الشرط الثالث بصيغة معكوسة.' },
      { q: 'He denied ___ the money.', o: ['taking', 'to take', 'take', 'took'], e: 'deny + اسم فعل (ing).' },
      { q: 'By next year she ___ here for ten years.', o: ['will have worked', 'works', 'will work', 'has worked'], e: 'المستقبل التام: will have + اسم مفعول.' },
      { q: 'The meeting was ___ off due to the strike.', o: ['called', 'put', 'taken', 'turned'], e: 'call off = يلغي.' },
      { q: 'Hardly ___ arrived when it started to rain.', o: ['had we', 'we had', 'did we', 'we have'], e: 'بعد Hardly نقلب الفاعل والفعل المساعد.' },
      { q: "I'd rather you ___ tell anyone.", o: ["didn't", "don't", "won't", "haven't"], e: "would rather + فاعل + ماضي." },
    ],
  },

  stories: {
    A1: [
      {
        id: 'en-a1-1', t: 'My Day',
        x: 'I get up at seven. I eat bread and drink tea. I go to work by bus. I work from eight to four. In the evening I cook dinner and talk to my family.',
        ar: 'أستيقظ في السابعة. آكل خبزًا وأشرب شايًا. أذهب إلى العمل بالحافلة. أعمل من الثامنة إلى الرابعة. في المساء أطبخ العشاء وأتحدث مع عائلتي.',
        v: [['bread', 'خبز'], ['tea', 'شاي'], ['bus', 'حافلة'], ['work', 'عمل / يعمل'], ['evening', 'مساء'], ['cook', 'يطبخ'], ['dinner', 'عشاء']],
        qs: [
          { q: 'What time does the speaker get up?', o: ['At seven', 'At six', 'At eight', 'At nine'] },
          { q: 'How does the speaker go to work?', o: ['By bus', 'By car', 'On foot', 'By train'] },
          { q: 'When does the speaker finish work?', o: ['At four', 'At five', 'At six', 'At two'] },
          { q: 'What does the speaker do in the evening?', o: ['Cooks dinner and talks to family', 'Watches a film', 'Goes shopping', 'Sleeps'] },
        ],
      },
      {
        id: 'en-a1-2', t: 'At the Shop',
        x: "Sara is at the shop. She wants milk, eggs and rice. The milk is two euros. The eggs are three euros. She pays and says, 'Thank you.' The man says, 'Have a good day.'",
        ar: 'سارة في المتجر. تريد حليبًا وبيضًا وأرزًا. الحليب بيوروين. البيض بثلاثة يورو. تدفع وتقول: «شكرًا». يقول الرجل: «يومًا سعيدًا».',
        v: [['shop', 'متجر'], ['milk', 'حليب'], ['eggs', 'بيض'], ['rice', 'أرز'], ['pays', 'تدفع'], ['thank', 'شكر']],
        qs: [
          { q: 'What does Sara want?', o: ['Milk, eggs and rice', 'Bread and fish', 'Fruit', 'Coffee and sugar'] },
          { q: 'How much is the milk?', o: ['Two euros', 'Three euros', 'One euro', 'Five euros'] },
          { q: 'How much are the eggs?', o: ['Three euros', 'Two euros', 'Four euros', 'One euro'] },
          { q: 'What does the man say?', o: ['Have a good day', 'Good night', 'See you next year', 'Please wait'] },
        ],
      },
      {
        id: 'en-a1-3', t: 'My Family',
        x: 'I have a big family. My mother is a nurse and my father is a driver. I have two brothers and one sister. We live in a small house near the park. On Sundays we eat lunch together.',
        ar: 'عندي عائلة كبيرة. أمي ممرّضة وأبي سائق. عندي أخوان وأخت واحدة. نسكن في بيت صغير قرب الحديقة. أيام الأحد نتناول الغداء معًا.',
        v: [['family', 'عائلة'], ['nurse', 'ممرّضة'], ['driver', 'سائق'], ['brothers', 'إخوة'], ['sister', 'أخت'], ['park', 'حديقة'], ['lunch', 'غداء']],
        qs: [
          { q: "What is the speaker's mother?", o: ['A nurse', 'A teacher', 'A driver', 'A cook'] },
          { q: 'How many brothers does the speaker have?', o: ['Two', 'One', 'Three', 'None'] },
          { q: 'Where is the house?', o: ['Near the park', 'Near the sea', 'In the mountains', 'Near a school'] },
          { q: 'What do they do on Sundays?', o: ['Eat lunch together', 'Go to work', 'Play football', 'Travel'] },
        ],
      },
    ],

    A2: [
      {
        id: 'en-a2-1', t: 'Lost in the City',
        x: "Tom is new in the city and he is lost. He wants to find the post office, but he cannot see it on his map. He asks a woman in the street. She says, 'Go straight, then turn left at the bank. The post office is next to the pharmacy.' Tom thanks her and follows her directions. Ten minutes later he finds the post office. It is closed because it is lunchtime, so he has to come back at two o'clock.",
        ar: 'توم جديد في المدينة وقد ضاع. يريد أن يجد مكتب البريد لكنه لا يراه على خريطته. يسأل امرأة في الشارع. تقول: «اذهب مباشرة ثم انعطف يسارًا عند البنك. مكتب البريد بجانب الصيدلية». يشكرها ويتبع إرشاداتها. بعد عشر دقائق يجد مكتب البريد. هو مغلق لأنه وقت الغداء فعليه أن يعود في الثانية.',
        v: [['lost', 'تائه / ضائع'], ['map', 'خريطة'], ['street', 'شارع'], ['straight', 'مباشرة'], ['turn', 'ينعطف'], ['pharmacy', 'صيدلية'], ['closed', 'مغلق']],
        qs: [
          { q: 'What is Tom looking for?', o: ['The post office', 'A bank', 'A pharmacy', 'A restaurant'] },
          { q: 'Where does he turn left?', o: ['At the bank', 'At the pharmacy', 'At the park', 'At the station'] },
          { q: 'Where is the post office?', o: ['Next to the pharmacy', 'Next to the bank', 'Behind the park', 'Opposite the station'] },
          { q: "Why can't Tom go in?", o: ['It is closed for lunch', 'He has no money', 'It is Sunday', 'He lost his map'] },
        ],
      },
      {
        id: 'en-a2-2', t: 'A Phone Call to the Clinic',
        x: "Lina has a bad cough and a sore throat. She calls the clinic to make an appointment. The receptionist says the doctor is free on Thursday at four o'clock. Lina cannot come at that time because she works until five, so she asks for another day. They agree on Friday morning at nine thirty. Before she hangs up, the receptionist reminds her to bring her ID card and her health insurance.",
        ar: 'لينا عندها سعال شديد والتهاب في الحلق. تتصل بالعيادة لتحجز موعدًا. تقول موظفة الاستقبال إن الطبيب متفرغ يوم الخميس في الرابعة. لينا لا تستطيع الحضور في ذلك الوقت لأنها تعمل حتى الخامسة، فتطلب يومًا آخر. يتفقان على صباح الجمعة في التاسعة والنصف. قبل أن تنهي المكالمة تذكّرها موظفة الاستقبال بإحضار بطاقة الهوية والتأمين الصحي.',
        v: [['cough', 'سعال'], ['sore', 'مؤلم / ملتهب'], ['appointment', 'موعد'], ['receptionist', 'موظفة الاستقبال'], ['free', 'متفرّغ'], ['insurance', 'تأمين'], ['reminds', 'تذكّر']],
        qs: [
          { q: 'What is wrong with Lina?', o: ['A cough and a sore throat', 'A broken leg', 'A headache and fever', 'A toothache'] },
          { q: "Why can't she come on Thursday?", o: ['She works until five', 'She is on holiday', 'The clinic is closed', 'She has no money'] },
          { q: 'When is the appointment?', o: ['Friday at nine thirty', 'Thursday at four', 'Friday at four', 'Monday at nine'] },
          { q: 'What must she bring?', o: ['ID card and health insurance', 'A letter and money', 'A photo', 'Her medicine'] },
        ],
      },
      {
        id: 'en-a2-3', t: 'A New Job',
        x: "Hassan starts a new job today at a bakery. He arrives early and meets his manager, Mr Brown. Mr Brown shows him the kitchen and gives him a white uniform. Hassan's first task is to put the bread on the shelves. He is nervous, but his colleagues are friendly and help him. At the end of the day Mr Brown says, 'Good work. See you tomorrow at six.'",
        ar: 'حسّان يبدأ اليوم عملًا جديدًا في مخبز. يصل مبكرًا ويقابل مديره السيد براون. يريه السيد براون المطبخ ويعطيه زيًّا أبيض. أول مهمة لحسّان هي وضع الخبز على الرفوف. هو متوتر لكن زملاءه ودودون ويساعدونه. في نهاية اليوم يقول السيد براون: «عمل جيد. أراك غدًا في السادسة».',
        v: [['bakery', 'مخبز'], ['manager', 'مدير'], ['uniform', 'زيّ موحّد'], ['shelves', 'رفوف'], ['nervous', 'متوتر'], ['colleagues', 'زملاء']],
        qs: [
          { q: 'Where does Hassan work?', o: ['At a bakery', 'At a hospital', 'At a school', 'At a bank'] },
          { q: 'What does the manager give him?', o: ['A white uniform', 'A key', 'A phone', 'A map'] },
          { q: 'What is his first task?', o: ['Put bread on the shelves', 'Clean the floor', 'Answer the phone', 'Bake cakes'] },
          { q: 'What time is he to come tomorrow?', o: ['Six', 'Eight', 'Nine', 'Four'] },
        ],
      },
      {
        id: 'en-a2-4', t: 'Weekend Plans',
        x: "This weekend the weather will be sunny, so Nadia and her friends are going to have a picnic in the park. Nadia will make sandwiches and her friend Julia will bring fruit and juice. They are going to meet at eleven o'clock near the lake. If it rains, they will go to a café instead. Nadia hopes it will not rain because she has bought a new ball for the game.",
        ar: 'هذا الأسبوع سيكون الطقس مشمسًا، لذلك ستقيم نادية وأصدقاؤها نزهة في الحديقة. ستعدّ نادية السندويشات وستحضر صديقتها جوليا الفاكهة والعصير. سيلتقون في الحادية عشرة قرب البحيرة. إذا أمطرت سيذهبون إلى مقهى بدلًا من ذلك. تأمل نادية ألّا تمطر لأنها اشترت كرة جديدة للّعب.',
        v: [['weather', 'طقس'], ['sunny', 'مشمس'], ['picnic', 'نزهة'], ['sandwiches', 'سندويشات'], ['lake', 'بحيرة'], ['instead', 'بدلًا من ذلك'], ['rains', 'تمطر']],
        qs: [
          { q: 'What are they going to do?', o: ['Have a picnic', 'Go swimming', 'Visit a museum', 'Watch a film'] },
          { q: 'Who will bring fruit and juice?', o: ['Julia', 'Nadia', 'Their teacher', 'Nobody'] },
          { q: 'Where will they meet?', o: ['Near the lake', 'At the café', "At Nadia's house", 'At the station'] },
          { q: 'What will they do if it rains?', o: ['Go to a café', 'Stay at home', 'Go to the cinema', 'Go shopping'] },
        ],
      },
    ],

    B1: [
      {
        id: 'en-b1-1', t: 'A Problem with the Landlord',
        x: 'When Maria moved into her flat, the landlord promised to repair the broken heating before winter. Two months later, nothing had been done, and the flat was freezing. Maria wrote him a polite message and kept a copy of it. When he did not reply, she called him and explained that she would contact the housing office if the problem was not solved. Within a week a technician arrived and fixed the heating. Maria learned that it is important to keep written records and to stay calm but firm.',
        ar: 'عندما انتقلت ماريا إلى شقتها وعد المالك بإصلاح التدفئة المعطّلة قبل الشتاء. بعد شهرين لم يُفعل شيء وكانت الشقة باردة جدًا. كتبت له ماريا رسالة مهذبة واحتفظت بنسخة منها. عندما لم يردّ اتصلت به وشرحت أنها ستتواصل مع مكتب الإسكان إن لم تُحلّ المشكلة. خلال أسبوع وصل فنّي وأصلح التدفئة. تعلّمت ماريا أن من المهم الاحتفاظ بسجلات مكتوبة والبقاء هادئة لكن حازمة.',
        v: [['landlord', 'مالك العقار'], ['repair', 'يصلح'], ['heating', 'تدفئة'], ['freezing', 'شديد البرودة'], ['polite', 'مهذّب'], ['technician', 'فنّي'], ['records', 'سجلات'], ['firm', 'حازم']],
        qs: [
          { q: 'What did the landlord promise?', o: ['To repair the heating', 'To lower the rent', 'To paint the flat', 'To buy furniture'] },
          { q: 'What did Maria do first?', o: ['Wrote a polite message and kept a copy', 'Moved out', 'Stopped paying rent', 'Called the police'] },
          { q: 'What did she say she would do?', o: ['Contact the housing office', 'Move to another city', 'Pay less', 'Change the lock'] },
          { q: 'What did she learn?', o: ['Keep written records and stay calm but firm', 'Never talk to landlords', 'Always pay late', 'Never sign a contract'] },
        ],
      },
      {
        id: 'en-b1-2', t: 'Learning a New Language',
        x: 'Karim has been learning English for a year, but he still feels nervous when he speaks. His teacher advised him to practise a little every day instead of studying for hours once a week. Now he listens to a short podcast on the bus, writes five sentences before bed and chats with a colleague during lunch. He has made many mistakes, but he has realised that mistakes are part of learning. Last month, for the first time, he understood a whole conversation in a café.',
        ar: 'كريم يتعلّم الإنجليزية منذ سنة لكنه ما زال يشعر بالتوتر عندما يتكلّم. نصحه معلّمه بأن يتدرّب قليلًا كل يوم بدل أن يدرس ساعات مرة في الأسبوع. الآن يستمع إلى بودكاست قصير في الحافلة، ويكتب خمس جمل قبل النوم، ويتحدث مع زميل وقت الغداء. ارتكب أخطاء كثيرة لكنه أدرك أن الأخطاء جزء من التعلّم. الشهر الماضي فهم لأول مرة محادثة كاملة في مقهى.',
        v: [['nervous', 'متوتر'], ['advised', 'نصح'], ['practise', 'يتدرّب'], ['podcast', 'بودكاست'], ['colleague', 'زميل'], ['realised', 'أدرك'], ['mistakes', 'أخطاء']],
        qs: [
          { q: 'How long has Karim been learning English?', o: ['For a year', 'For a week', 'For ten years', 'For a month'] },
          { q: 'What did his teacher advise?', o: ['Practise a little every day', 'Study only on weekends', 'Stop speaking', 'Move abroad'] },
          { q: 'What does he do on the bus?', o: ['Listens to a podcast', 'Reads a book', 'Sleeps', 'Writes emails'] },
          { q: 'What happened last month?', o: ['He understood a whole conversation', 'He passed an exam', 'He lost his job', 'He changed teacher'] },
        ],
      },
      {
        id: 'en-b1-3', t: 'The Job Interview',
        x: 'Yusuf had an interview for a warehouse job last Tuesday. He prepared by reading about the company and practising answers to common questions. During the interview, the manager asked why he wanted the job. Yusuf said that he was reliable, learned quickly and wanted a stable job. The manager also asked about his availability, and Yusuf explained that he could work any shift except Sunday mornings. Two days later he received a phone call offering him a three-month contract with the possibility of extension.',
        ar: 'كان ليوسف مقابلة لوظيفة في مستودع يوم الثلاثاء الماضي. استعدّ بقراءة معلومات عن الشركة وبالتدرّب على أجوبة الأسئلة الشائعة. أثناء المقابلة سأل المدير لماذا يريد الوظيفة. قال يوسف إنه يُعتمد عليه ويتعلّم بسرعة ويريد عملًا مستقرًا. سأل المدير أيضًا عن أوقات توفّره، فشرح يوسف أنه يستطيع العمل في أي وردية عدا صباح الأحد. بعد يومين تلقّى مكالمة تعرض عليه عقدًا لثلاثة أشهر مع إمكانية التمديد.',
        v: [['interview', 'مقابلة'], ['warehouse', 'مستودع'], ['prepared', 'استعدّ'], ['reliable', 'يُعتمد عليه'], ['stable', 'مستقر'], ['shift', 'وردية'], ['contract', 'عقد'], ['extension', 'تمديد']],
        qs: [
          { q: 'How did Yusuf prepare?', o: ['Read about the company and practised answers', 'Bought new shoes', 'Asked a friend to go', 'Did not prepare'] },
          { q: 'What did he say about himself?', o: ['Reliable and learns quickly', 'Always late', 'Wanted a holiday', 'Had a lot of experience'] },
          { q: "When can't he work?", o: ['Sunday mornings', 'Saturday', 'Monday', 'Every evening'] },
          { q: 'What was the offer?', o: ['A three-month contract', 'A permanent contract', 'A part-time job', 'Nothing'] },
        ],
      },
      {
        id: 'en-b1-4', t: 'A Trip to the Mountains',
        x: 'Last weekend we drove to the mountains to escape the heat of the city. The road was narrow and we had to stop twice because of fog. When we finally arrived, the village was quiet and the air was fresh. We stayed in a small guesthouse owned by an elderly couple, who cooked us a delicious dinner from vegetables they had grown themselves. The next morning we hiked to a waterfall. It took three hours, but the view was worth every step.',
        ar: 'في نهاية الأسبوع الماضي سافرنا بالسيارة إلى الجبال لنهرب من حرّ المدينة. كان الطريق ضيقًا واضطررنا للتوقف مرتين بسبب الضباب. عندما وصلنا أخيرًا كانت القرية هادئة والهواء نقيًا. أقمنا في بيت ضيافة صغير يملكه زوجان مسنّان طبخا لنا عشاءً لذيذًا من خضار زرعاها بنفسيهما. في صباح اليوم التالي مشينا إلى شلال. استغرق ذلك ثلاث ساعات لكن المنظر كان يستحق كل خطوة.',
        v: [['escape', 'يهرب'], ['narrow', 'ضيّق'], ['fog', 'ضباب'], ['guesthouse', 'بيت ضيافة'], ['elderly', 'مسنّ'], ['hiked', 'مشى مسافات طويلة'], ['waterfall', 'شلال']],
        qs: [
          { q: 'Why did they go to the mountains?', o: ['To escape the heat', 'To visit family', 'To work', 'To buy furniture'] },
          { q: 'Why did they stop twice?', o: ['Because of fog', 'Because of a flat tyre', 'To eat', 'To take photos'] },
          { q: 'Who owned the guesthouse?', o: ['An elderly couple', 'A young man', 'A company', 'A hotel chain'] },
          { q: 'How long was the hike?', o: ['Three hours', 'One hour', 'Six hours', 'Ten minutes'] },
        ],
      },
    ],

    B2: [
      {
        id: 'en-b2-1', t: 'Working Abroad',
        x: "Moving abroad for work sounds exciting, but Layla discovered that it demands more than a plane ticket and a good CV. During her first months she struggled to understand her colleagues' humour and the unwritten rules of the workplace. She also underestimated how lonely it could feel to build a social life from scratch. What helped her most was joining a local volunteering group, where she met people outside work and practised the language in a relaxed setting. Looking back, she believes that adapting is less about changing who you are and more about staying curious and patient with yourself.",
        ar: 'الانتقال للعمل في الخارج يبدو مثيرًا، لكن ليلى اكتشفت أنه يتطلب أكثر من تذكرة طائرة وسيرة ذاتية جيدة. في أشهرها الأولى عانت لفهم دعابة زملائها والقواعد غير المكتوبة في مكان العمل. كما قلّلت من تقدير مدى الشعور بالوحدة عند بناء حياة اجتماعية من الصفر. أكثر ما ساعدها كان الانضمام إلى مجموعة تطوّع محلية، حيث تعرّفت إلى أناس خارج العمل ومارست اللغة في أجواء مريحة. وهي ترى الآن أن التكيّف لا يعني أن تغيّر من أنت بقدر ما يعني أن تبقى فضوليًا وصبورًا مع نفسك.',
        v: [['demands', 'يتطلّب'], ['struggled', 'عانى / كافح'], ['workplace', 'مكان العمل'], ['underestimated', 'قلّل من التقدير'], ['scratch', 'الصفر (from scratch = من البداية)'], ['volunteering', 'تطوّع'], ['adapting', 'التكيّف'], ['curious', 'فضولي']],
        qs: [
          { q: 'What did Layla underestimate?', o: ['How lonely it could feel', 'The cost of flights', 'Her salary', 'The weather'] },
          { q: 'What helped her most?', o: ['Joining a volunteering group', 'Changing her job', 'Moving back', 'Working longer hours'] },
          { q: 'What did she struggle to understand at first?', o: ["Her colleagues' humour and unwritten rules", 'The contract', 'The bus system', 'Her salary slip'] },
          { q: 'What does she believe about adapting?', o: ['It is about being curious and patient', 'It is about changing who you are', 'It is impossible', 'It happens quickly'] },
        ],
      },
      {
        id: 'en-b2-2', t: 'Learning from Mistakes',
        x: 'Many adults avoid speaking a foreign language because they fear making mistakes in front of others. However, research on language learning suggests that errors are not a sign of failure but a necessary step towards fluency. Each time a learner is corrected, the brain adjusts its expectations and stores the correct form more firmly. The key is to create situations where mistakes carry little risk, such as talking to a patient friend or recording yourself. Over time, confidence grows, and the fear that once seemed overwhelming gradually fades.',
        ar: 'كثير من البالغين يتجنبون التحدث بلغة أجنبية لأنهم يخافون من ارتكاب الأخطاء أمام الآخرين. لكن الأبحاث في تعلّم اللغات تشير إلى أن الأخطاء ليست علامة فشل بل خطوة ضرورية نحو الطلاقة. كل مرة يُصحَّح فيها المتعلّم يعدّل الدماغ توقعاته ويخزّن الصيغة الصحيحة بشكل أرسخ. المفتاح هو خلق مواقف قليلة المخاطر مثل الحديث مع صديق صبور أو تسجيل صوتك. مع الوقت تنمو الثقة ويتلاشى تدريجيًا الخوف الذي بدا يومًا ساحقًا.',
        v: [['fear', 'يخاف / خوف'], ['errors', 'أخطاء'], ['fluency', 'طلاقة'], ['corrected', 'يُصحَّح'], ['adjusts', 'يعدّل'], ['patient', 'صبور'], ['overwhelming', 'ساحق / طاغٍ'], ['fades', 'يتلاشى']],
        qs: [
          { q: 'Why do many adults avoid speaking?', o: ['They fear making mistakes', 'They have no time', 'They dislike grammar', 'They are too busy'] },
          { q: 'According to the text, errors are...', o: ['a necessary step towards fluency', 'a sign of failure', 'impossible to avoid', 'unimportant'] },
          { q: 'What happens when a learner is corrected?', o: ['The brain stores the correct form more firmly', 'The learner forgets', 'Nothing changes', 'The fear grows'] },
          { q: 'What is the key to practising?', o: ['Situations where mistakes carry little risk', 'Speaking only to teachers', 'Avoiding mistakes completely', 'Studying alone only'] },
        ],
      },
      {
        id: 'en-b2-3', t: 'Negotiating a Salary',
        x: 'Omar was offered a job at a logistics company, but the salary was lower than he had expected. Instead of accepting immediately, he asked for a day to think it over. He researched typical salaries for similar positions and prepared a clear, polite argument based on his experience. When he called the manager the next day, he thanked her for the offer, explained what he could bring to the team and asked whether there was any flexibility. She could not raise the salary, but she agreed to review it after six months and to add extra holiday days. Omar accepted, satisfied that he had spoken up respectfully.',
        ar: 'عُرضت على عمر وظيفة في شركة لوجستيات لكن الراتب كان أقل مما توقّع. بدل أن يقبل فورًا طلب يومًا ليفكّر. بحث عن الرواتب المعتادة لوظائف مشابهة وجهّز حجة واضحة ومهذبة مبنية على خبرته. عندما اتصل بالمديرة في اليوم التالي شكرها على العرض وشرح ما يمكنه تقديمه للفريق وسأل إن كانت هناك مرونة. لم تستطع رفع الراتب لكنها وافقت على مراجعته بعد ستة أشهر وعلى إضافة أيام إجازة. قبل عمر وهو راضٍ لأنه عبّر عن رأيه باحترام.',
        v: [['offered', 'عُرض عليه'], ['logistics', 'لوجستيات'], ['researched', 'بحث'], ['argument', 'حجة'], ['flexibility', 'مرونة'], ['review', 'يراجع'], ['respectfully', 'باحترام']],
        qs: [
          { q: 'Why did Omar not accept at once?', o: ['The salary was lower than expected', 'He disliked the company', 'He had another job', 'He was on holiday'] },
          { q: 'What did he do before calling the manager?', o: ['Researched typical salaries', 'Asked friends for money', 'Quit his job', 'Wrote a complaint'] },
          { q: 'What did the manager agree to?', o: ['Review the salary after six months', 'Double the salary', 'Give a car', 'Cancel the contract'] },
          { q: 'How did Omar feel at the end?', o: ['Satisfied', 'Angry', 'Worried', 'Bored'] },
        ],
      },
    ],
  },

  writing: {
    A1: [
      { p: 'عرّف بنفسك: اسمك، بلدك، عملك.', m: 'My name is Ali. I am from Syria. I live in Athens. I work in a restaurant.' },
      { p: 'اكتب ماذا تأكل وتشرب في الصباح.', m: 'In the morning I drink tea and eat bread with cheese.' },
    ],
    A2: [
      { p: 'اكتب عن عطلة نهاية الأسبوع الماضية (٣ جمل).', m: 'Last weekend I visited my friend. We cooked dinner and watched a film. I went to bed late.' },
      { p: 'اكتب عن عملك أو دراستك (٣ جمل).', m: 'I work in a shop. I start at nine and finish at five. I like my colleagues.' },
    ],
    B1: [
      { p: 'صِف مشكلة واجهتك وكيف حللتها.', m: 'Last month I had a problem with my phone bill. I called the company and explained the situation. In the end they corrected the mistake.' },
      { p: 'اكتب عن هدف تتعلم من أجله اللغة.', m: 'I am learning English because I want a better job. I practise every day, and I hope to pass an exam next year.' },
    ],
    B2: [
      { p: 'هل يجب أن يتعلّم الأطفال لغتين في المدرسة؟ اذكر أسبابك.', m: 'I believe children should learn two languages at school. It improves their memory, opens more job opportunities later, and helps them understand other cultures.' },
      { p: 'اكتب عن تجربة تعلّمت منها من خطأ.', m: 'Once I signed a document without reading it carefully. Although it caused some difficulties, I learned to always ask questions before agreeing to anything.' },
    ],
  },
};
