/* =====================================================================
   INTERACTIVE CLIENT ACQUISITION  |  Coach config
   Coach: Live Before You Die (Brett Bailey)

   Everything a coach can change lives in this one file. The engine
   (index.html) never needs editing to launch a new coach or a new
   assessment. Rules of the file:
   - No em dashes in anything a person will read.
   - Scores are always 0 to 100 inside rules.
   - A pattern is a pattern, never a grade. Never judge the person.
   ===================================================================== */
window.ICA = {

  coach: {
    slug: "lbyd",                      // must match the coaches table in Supabase and COACH_SLUG on Netlify
    name: "Live Before You Die",
    owner: "Brett Bailey",
    logo: "assets/logo.webp",           // 560px, about 20 KB. If missing the name shows instead
    programLine: "Live Before You Die helps driven founders win at work and at home. If this landed, here\u2019s how to keep going."
  },

  defaultAssessment: "scorecard",      // what the bare site address opens
  linkBetweenAssessments: false,       // false: each assessment is its own link and people never see the other one

  /* PDFs: for the demo they're baked into assets/pdfs/. To take download bandwidth off Netlify later,
     upload them to Google Drive ("anyone with the link") and paste the normal share link into each
     pattern's `pdf` field; the engine turns it into a direct download. Nothing else changes. */

  /* ---------- Lead capture (sits between the last question and the results) ---------- */
  gate: {
    heading: "Your results are ready.",
    body: "Put your name down so we can keep a copy of your results for you. Your pattern, your scores and your three actions are on the next screen.",
    fields: [
      { key: "name",      label: "First name",       type: "text",  required: true,  autocomplete: "given-name" },
      { key: "whatsapp",  label: "WhatsApp number",  type: "tel",   required: true,  autocomplete: "tel", hint: "Include your country code, for example +1 242 or +1 204." },
      { key: "email",     label: "Email",            type: "email", required: false, autocomplete: "email" },
      { key: "instagram", label: "Instagram handle", type: "text",  required: false, autocomplete: "off", prefix: "@" },
      { key: "revenue",   label: "Annual revenue",   type: "select", required: false,
        options: ["Under $250k", "$250k to $500k", "$500k to $2M", "$2M to $10M", "$10M+", "Prefer not to say"] }
    ],
    consent: "By continuing you agree that Brett's team at Live Before You Die can contact you about your results.",
    button: "Show my results",
    note: "Your answers go to Brett and his team only. Nothing is shared or sold."
  },

  /* ---------- Offers shown at the bottom of every results page ----------
     Same structure and links as the closing page of every LBYD guide (Nov 2026).
     enabled:false hides one. url empty hides one. `when` is optional: a rule that reads the lead
     (their capture answers) and s (their scores: s.dims, s.overall, s.pattern, s.branch) and
     returns true to show the offer. No `when` = shown to everyone. */
  offers: {
    heading: "What comes next",
    items: [
      { id: "community", enabled: true, title: "Join the community",
        body: "Build real relationships with founders who get it. Brett leads the personal side, Noah leads the business side.",
        button: "Join the community", url: "https://www.skool.com/livebeforeyoudie/about" },
      { id: "noah", enabled: true, title: "Work with Noah one-on-one",
        body: "A Sales Leak Diagnostic and a done-for-you sales system, so the business stops running through you.",
        button: "Talk to Noah", url: "https://form.jotform.com/262762618270056" },
      { id: "brett", enabled: true, title: "Work with Brett one-on-one",
        body: "Deep coaching on purpose, connection and performance, including the 7-day experience.",
        button: "Book a call with Brett", url: "https://calendly.com/brettroderickbailey/1-1-w-brett-60" },
      { id: "workshop", enabled: false, title: "Join the free online workshop",
        body: "Brett hosts it live twice a month. Bring your results and your questions.",
        button: "Save my seat", url: "https://form.jotform.com/262708463844061" }
    ]
  },

  assessments: {

    /* =================================================================
       ASSESSMENT 1: ARE YOU WINNING EVERYWHERE? THE 5-MINUTE FOUNDER SCORECARD
       Ported from the kit's founder-scorecard (Nov 2026). Scale 1 to 5.
       The 10 items marked client:true are Brett's client scorecard, so a
       lead's score is his Day 0 baseline. Connection questions branch on
       whether the person has a partner.
       ================================================================= */
    scorecard: {
      id: "scorecard",
      title: "Are You Winning Everywhere?",
      subtitle: "The 5-Minute Founder Scorecard. You can\u2019t outperform your home life.",
      lede: "Twenty honest answers. At the end you\u2019ll see your founder profile, your score across purpose, connection, performance and time, the one area quietly capping you, and three things to do this week.",
      minutes: "About 5 minutes",
      privacy: "This is a self-reflection tool, not a diagnosis.",

      patternKicker: "Your founder profile",
      patternWord: "profile",              // used in "Your profile: ..." on the actions list
      overall: true,                       // show an overall score (average of the four pillars) in the hero
      lowestOrder: ["connection", "purpose", "performance", "time"],   // tie-break for the lowest area; Connection first, the core buyer

      /* Profile is decided by the shape of the scores, not by picks. s.dims is 0 to 100, s.low is the lowest area. */
      profile: s => {
        const d = s.dims, min = Math.min(d.purpose, d.connection, d.performance, d.time);
        if (min >= 70) return "integrated";
        if (d.purpose >= 60 && (d.performance + d.time) / 2 < 50) return "burning";
        return { connection: "lone", purpose: "drifting", performance: "burning", time: "burning" }[s.low];
      },
      patternOrder: ["lone", "drifting", "burning", "integrated"],

      patterns: {
        integrated: { name: "The Integrated Performer", tag: "Winning everywhere. Now go further.",
          body: "Your work, your home and your energy are pulling in the same direction. That\u2019s rare, and it\u2019s a real edge. The question now isn\u2019t what\u2019s broken. It\u2019s how far you can take it.",
          footLabel: "What this means", foot: "Home is fuel, not drain. Your next edge is keeping it that way when the pressure spikes.",
          action: "Pick one founder you know who\u2019s winning at work and quietly losing at home. Ask him how home really is, then just listen.",
          video: "", pdf: "assets/pdfs/LBYD-Profile-Integrated-Performer.pdf" },
        lone: { name: "The Lone Operator", tag: "Winning at work. Alone everywhere else.",
          body: "Your output is real. But the people closest to you are getting what\u2019s left of you, and that gap is quietly capping your performance. You can\u2019t outperform your home life.",
          footLabel: "The cost", foot: "Wins that don\u2019t land, because there\u2019s no one to really share them with, and a tank that never fully refills.",
          action: "Tonight, before you say a word about the business, tell someone you love one true thing about how your week actually felt.",
          video: "", pdf: "assets/pdfs/LBYD-Profile-Lone-Operator.pdf" },
        burning: { name: "The Burning Engine", tag: "All drive, running low on fuel.",
          body: "You know why you\u2019re building and you\u2019re pushing hard. But your energy and your hours are draining faster than you refill them. You\u2019ve maxed out the push. The next level comes from recovery and better systems, not more pressure.",
          footLabel: "The cost", foot: "Every hour you work is worth less than it should be, and the people at home get the fumes.",
          action: "Tomorrow, go home on time. Not to fix anything. Just to be there. Notice what you reach for instead.",
          video: "", pdf: "assets/pdfs/LBYD-Profile-Burning-Engine.pdf" },
        drifting: { name: "The Drifting Achiever", tag: "The results are there. The why isn\u2019t.",
          body: "You\u2019ve hit numbers you once dreamed about and felt less than you expected. That isn\u2019t ingratitude. It\u2019s a signal that the next level isn\u2019t another target. It\u2019s clarity on what all of it is for.",
          footLabel: "The cost", foot: "Work becomes an escape instead of a passion, and \u201cis this it?\u201d starts showing up more often.",
          action: "Tomorrow morning, before your phone, write one sentence: \u201cI\u2019m building ___ so that ___.\u201d If the second blank is hard, that\u2019s the work.",
          video: "", pdf: "assets/pdfs/LBYD-Profile-Drifting-Achiever.pdf" }
      },

      dimensions: {
        purpose:     { label: "Purpose",     sub: "Clarity on why you\u2019re building and what it\u2019s for", group: "pillars",
          why: "When you\u2019re not clear on what it\u2019s for, every win feels smaller and every hard week feels heavier.",
          action: "This week, finish this sentence and put it where you\u2019ll see it every morning: \u201cEverything I\u2019m building is for ___.\u201d If you can\u2019t finish it, that\u2019s your answer.",
          notes: { high: "You know what you\u2019re building and why, and the wins land.", mid: "The why is there, but it goes quiet under pressure.", low: "You\u2019re building hard, but the reason has gone blurry." } },
        connection:  { label: "Connection",  sub: "Your partnership, family and real friendships", group: "pillars",
          why: "This is the variable most high performers get wrong. What happens at home either refuels you every night or drains you all day.",
          action: { partner: "Pick three nights this week. Phone in another room from the moment you walk in until your partner goes to bed. Ask one real question each night and hear the full answer.",
                    single: "This week, call two people outside work who matter to you. Not a text. Tell each of them one real thing you\u2019re dealing with right now." },
          notes: { high: "The people closest to you know what you\u2019re carrying, and they\u2019re in your corner.", mid: "You\u2019re there, but not always fully there.", low: "Home is running on empty, and that follows you into every meeting." } },
        performance: { label: "Performance", sub: "Energy, focus, sleep and decision-making", group: "pillars",
          why: "Energy, focus and sleep are the base everything else runs on. When they slip, every hour you work is worth less.",
          action: "This week: no caffeine after noon and no screens in the last 30 minutes before bed. Rate your energy 1 to 10 each morning, then compare day 1 to day 7.",
          notes: { high: "Your energy, focus and sleep are holding up.", mid: "You run well some days and on fumes on others.", low: "You\u2019re performing on depleted reserves, and it\u2019s showing in your decisions." } },
        time:        { label: "Time",        sub: "Hours on work only you can do", group: "pillars",
          why: "Every hour on work someone else could do is an hour taken from your highest-value work, and from home.",
          action: "For three days, write down every task you do. Circle the ones only you can do. By Friday, delegate, automate or delete one of the rest.",
          notes: { high: "Your week is spent on work only you can do, and your calendar is yours.", mid: "You\u2019ve got some leverage, but the week still runs you more than you run it.", low: "Most of your week is work someone or something else could do." } }
      },

      groups: [
        { id: "pillars", title: "Your four pillars", leadLowest: "Your biggest leverage point is {low}. That\u2019s where a little attention goes the furthest.",
          labels: { high: "Operating at your peak", mid: "Solid, with room to climb", low: "Quietly capping you" }, thresholds: [75, 50], lowestFrom: true }
      ],

      /* No priority rules here: action two is always the lowest area, with its "why" line. Action three is the next lowest. */
      rules: [],

      scaleHint: "1 is not true at all. 5 is completely true.",
      scaleEnds: ["Not true", "Completely true"],

      questions: [
        { type: "branch", part: "First", q: "Are you in a relationship right now?", hint: "This decides which Connection questions you get. Everything else is the same.",
          opts: [["Yes, in a relationship or married", "partner"], ["No, I\u2019m single", "single"]] },
        { type: "scale", part: "Purpose", key: "purpose", client: true, q: "I can explain clearly what my success is ultimately for." },
        { type: "scale", part: "Performance", key: "performance", client: true, q: "I wake up with energy most days without relying on caffeine." },
        { type: "scale", part: "Connection", key: "connection", branch: "partner", client: true, q: "My relationship with my partner is strong right now." },
        { type: "scale", part: "Connection", key: "connection", branch: "single", client: true, q: "My closest relationships are strong right now." },
        { type: "scale", part: "Time", key: "time", client: true, q: "I spend most of my week on work only I can do." },
        { type: "scale", part: "Purpose", key: "purpose", client: true, q: "When I hit a big goal, I feel genuinely fulfilled, not just relieved." },
        { type: "scale", part: "Performance", key: "performance", client: true, q: "I can do 2+ hours of deep, focused work most days." },
        { type: "scale", part: "Connection", key: "connection", branch: "partner", client: true, q: "My partner would say I\u2019m fully present when I\u2019m home." },
        { type: "scale", part: "Connection", key: "connection", branch: "single", client: true, q: "When I\u2019m with people I care about, I\u2019m fully present, not in my phone or in my head about work." },
        { type: "scale", part: "Time", key: "time", client: true, q: "I feel in control of my calendar." },
        { type: "scale", part: "Performance", key: "performance", client: true, q: "I sleep well and wake up rested." },
        { type: "scale", part: "Connection", key: "connection", client: true, q: "I have at least two people outside work who know what I\u2019m really going through." },
        { type: "scale", part: "Purpose", key: "purpose", q: "My daily work lines up with what I actually care about." },
        { type: "scale", part: "Time", key: "time", q: "My business could run for a week without me." },
        { type: "scale", part: "Performance", key: "performance", q: "I make my biggest decisions with a clear head, not running on fumes." },
        { type: "scale", part: "Connection", key: "connection", branch: "partner", q: "When there\u2019s tension at home, we talk it through instead of letting it sit." },
        { type: "scale", part: "Connection", key: "connection", branch: "single", q: "I\u2019m building the kind of life a great partner would want to be part of." },
        { type: "scale", part: "Purpose", key: "purpose", q: "I rarely catch myself asking \u201cis this it?\u201d" },
        { type: "scale", part: "Time", key: "time", q: "Busywork and admin take up very little of my week." },
        { type: "scale", part: "Performance", key: "performance", q: "My results are still climbing, not stuck at a plateau." },
        { type: "scale", part: "Connection", key: "connection", branch: "partner", q: "I come home with energy left for the people I love." },
        { type: "scale", part: "Connection", key: "connection", branch: "single", q: "Outside work, I make real time for people, not just networking." },
        { type: "scale", part: "Time", key: "time", q: "I have time every week that\u2019s protected for life outside work." },
        { type: "scale", part: "Purpose", key: "purpose", q: "If I kept living exactly like this for ten more years, I\u2019d be proud of it." }
      ],

      results: {
        overallLabel: "Overall",
        actionsTitle: "Three things to do this week",
        actionsLead: "Small on purpose. Pick one, or do all three.",
        note: "Most high performers try to fix their energy with supplements, cold plunges and morning routines. Those help. But if home is draining you, you\u2019re filling a bucket with a hole in it.",
        care: "If answering this stirred something up at home, don\u2019t sit on it alone. Bring it to a coach, a friend who knows you, or a therapist.",
        videoTitle: "A message from Brett for this profile",
        pdfTitle: "Your 7-day plan",
        pdfBody: "A short guide written for your profile: what it\u2019s costing you, one action a day for seven days, and the scorecard to retake in 30 days.",
        pdfButton: "Download your guide"
      }
    },

    /* =================================================================
       ASSESSMENT 2: HEART OVER HEAD CHECK-IN
       Carried over from the v1 check-in (Oct 20, 2026). Same content.
       ================================================================= */
    "heart-over-head": {
      id: "heart-over-head",
      title: "Heart Over Head",
      subtitle: "A five-minute check-in on how you treat yourself and the people around you.",
      lede: "Answer honestly. At the end you\u2019ll see your pattern, the need you\u2019re running lowest on, and three things you can do tomorrow.",
      minutes: "About 5 minutes",
      privacy: "This is a self-reflection tool, not a diagnosis.",

      patternKicker: "Your pattern under pressure",
      patternOrder: ["A", "W", "D", "L"],
      forcePattern: { key: "L", min: 3 },

      patterns: {
        D: { name: "The Defender", tag: "When things get tense, you make your case.",
          body: "Under pressure, a protector in you steps up to explain, justify or push back. It isn\u2019t trying to win for the sake of it. It\u2019s trying to keep you from being seen as wrong, or blamed for something that isn\u2019t yours.",
          footLabel: "What it\u2019s protecting", foot: "Usually your need for respect, and to be understood.",
          action: "The next time you feel the urge to explain yourself, ask one question first: \u201cWhat\u2019s going on for you?\u201d Explain afterward, only if you still need to.",
          video: "", pdf: "assets/pdfs/LBYD-Heart-Over-Head-Workbook.pdf" },
        A: { name: "The Absorber", tag: "When something goes wrong, you take it all on.",
          body: "Before anyone else says a word, a part of you has already decided it was your fault. It believes that carrying the blame keeps the peace. It\u2019s generous, and it\u2019s exhausting.",
          footLabel: "What it\u2019s protecting", foot: "Usually your need for connection, and for things to feel safe again.",
          action: "Say this once tomorrow, out loud or in your head: \u201cI can affect this without being responsible for it.\u201d Then name what you actually own: your words, your actions, your repair.",
          video: "", pdf: "assets/pdfs/LBYD-Heart-Over-Head-Workbook.pdf" },
        W: { name: "The Withdrawer", tag: "When things heat up, you go quiet.",
          body: "A part of you pulls back to keep the peace, or to keep you from getting hurt. From the outside it can look like calm. On the inside, the need never gets said, so it never gets met.",
          footLabel: "What it\u2019s protecting", foot: "Usually your need for safety, and for some space.",
          action: "Pick one small thing you\u2019d normally let slide and say it, kindly, before the day ends: \u201cWhen ___ happened, I felt ___, because I need ___.\u201d",
          video: "", pdf: "assets/pdfs/LBYD-Heart-Over-Head-Workbook.pdf" },
        L: { name: "The Listener", tag: "Under pressure, you get curious.",
          body: "When someone\u2019s behavior lands on you, you tend to look for the need underneath it instead of the person to blame. That\u2019s rare, and it\u2019s the core of everything Heart Over Head teaches.",
          footLabel: "Your next edge", foot: "Often turning that same curiosity inward.",
          action: "Tonight, find one judgment you made about yourself today. Ask it: \u201cWhat were you trying to do for me?\u201d Write down the answer.",
          video: "", pdf: "assets/pdfs/LBYD-Heart-Over-Head-Workbook.pdf" }
      },

      dimensions: {
        critic: { label: "Inner critic", group: "self",
          notes: { high: "A part of you works hard to keep you in line, mostly by judging you.", mid: "Your critic shows up, but it doesn\u2019t run the show.", low: "You tend to meet yourself with patience." } },
        blame:  { label: "Blame reflex", group: "self",
          notes: { high: "When others let you down, the judgment comes fast.", mid: "Sometimes you make others wrong, sometimes you get curious.", low: "You tend to look for the need behind other people\u2019s behavior." } },
        repair: { label: "Repair", group: "self",
          labels: { high: "Strong", mid: "Growing", low: "Where you get stuck" },
          notes: { high: "You can own your part and move on clean.", mid: "You can repair, but guilt slows you down.", low: "After conflict, blame or shame tends to take over." } },
        connection: { label: "Connection", sub: "Seen, heard, valued", group: "needs",
          action: "Send one message tomorrow that isn\u2019t logistics. Ask someone you care about how they really are, then just listen." },
        safety:     { label: "Safety", sub: "Security, stability, trust", group: "needs",
          action: "Tomorrow, name one thing you\u2019re worried about and one small step that would make you feel more secure. Do the step before noon." },
        rest:       { label: "Rest & ease", sub: "Space, restoration, play", group: "needs",
          action: "Block 30 minutes tomorrow with nothing in it. When the guilt shows up, tell that part: \u201cRest is how we keep momentum.\u201d" },
        autonomy:   { label: "Autonomy", sub: "Choice, freedom", group: "needs",
          action: "Make one choice tomorrow purely because you want to. Notice whose approval you checked for first, in your head." },
        meaning:    { label: "Meaning", sub: "Purpose, growth, contribution", group: "needs",
          action: "Spend 20 minutes tomorrow on the thing you\u2019d do even if nobody paid you. Do it before you open your messages." },
        respect:    { label: "Respect", sub: "Recognition, fairness", group: "needs",
          action: "Tomorrow, make one clear, kind request instead of hoping someone notices: \u201cWould you be willing to ___?\u201d" }
      },

      groups: [
        { id: "self", title: "How you treat yourself and others", lead: "These aren\u2019t grades. They\u2019re patterns, and patterns change.",
          labels: { high: "Loud", mid: "Moderate", low: "Quiet" }, lowIsBad: false },
        { id: "needs", title: "Your needs right now", leadLowest: "Your lowest is {low}. That\u2019s where a little attention goes the furthest.",
          labels: { high: "Well met", mid: "Partly met", low: "Running low" }, thresholds: [75, 40], lowestFrom: true }
      ],

      rules: [
        { dim: "rest", when: s => s.dims.critic >= 60 && s.dims.rest <= 40, why: "Your inner critic and your need for rest",
          action: "When the guilt about resting kicks in tomorrow, answer both parts: \u201cTired part, of course you need rest. Driven part, I know you\u2019re worried we\u2019ll fall behind. Rest is how we keep going.\u201d" },
        { when: s => s.dims.critic >= 60, why: "Your inner critic is loud",
          action: "Tomorrow, write down the critic\u2019s exact words the first time it speaks. Then answer it: \u201cI see how hard you work to protect me. What are you afraid of?\u201d" },
        { when: s => s.dims.repair <= 40, why: "Repair is where you get stuck",
          action: "Think of one recent moment you showed up poorly. Write two lines: \u201cThe part of me that did that was ___.\u201d and \u201cThe part that feels bad about it cares about ___.\u201d Then decide one clean repair." },
        { when: s => s.dims.blame >= 60, why: "Your blame reflex is quick",
          action: "Catch one judgment about someone tomorrow (\u201cthey\u2019re so ___\u201d). Rewrite it as their need: \u201cThey might be needing ___.\u201d" },
        { when: s => s.dims.critic < 40 && s.dims.blame < 40 && s.dims.repair >= 60, why: "You\u2019re in a strong place",
          action: "Teach it. Share one idea from Heart Over Head with someone tomorrow. Explaining it is how it sticks." }
      ],

      scenarioHint: "Pick the one closest to your first reaction, not the one you wish you\u2019d do.",
      scaleHint: "1 is not me at all. 5 is very me.",

      questions: [
        { type: "scenario", part: "How you react", q: "You walk in after a long day and your partner is already upset with you. Your first move?",
          opts: [["Explain how hard your day was", "D"], ["Go quiet and give it space until it passes", "W"], ["Apologize right away, even if you\u2019re not sure what you did", "A"], ["Ask what\u2019s going on, and listen", "L"]] },
        { type: "scale", part: "You and you", key: "critic", max: 5, ends: ["Not me", "Very me"], q: "When I take a day off, I feel guilty by the afternoon." },
        { type: "scenario", part: "How you react", q: "A project you were counting on didn\u2019t land on time. Your first move?",
          opts: [["Make it clear this isn\u2019t acceptable", "D"], ["Say nothing and just do it yourself", "W"], ["Assume you didn\u2019t explain it well enough", "A"], ["Ask what got in the way", "L"]] },
        { type: "scale", part: "You and you", key: "critic", max: 5, ends: ["Not me", "Very me"], q: "When I put something off, I call myself lazy or undisciplined." },
        { type: "scale", part: "You and others", key: "blame", max: 5, ends: ["Not me", "Very me"], q: "When plans fall through, I take it as a sign I\u2019m not a priority." },
        { type: "scenario", part: "How you react", q: "A parent questions your business, where you live or the path you\u2019ve chosen. Your first move?",
          opts: [["Push back and defend your choices", "D"], ["Change the subject or end the call", "W"], ["Start doubting yourself for days", "A"], ["Hear the worry underneath it", "L"]] },
        { type: "scale", part: "You and you", key: "critic", max: 5, ends: ["Not me", "Very me"], q: "After I snap at someone, I replay it and beat myself up for hours.", also: { key: "repair", reverse: true } },
        { type: "scale", part: "You and others", key: "blame", max: 5, ends: ["Not me", "Very me"], q: "When someone lets me down, I decide they\u2019re just unreliable." },
        { type: "scenario", part: "How you react", q: "A friend cancels on you an hour before plans you were looking forward to. Your first move?",
          opts: [["Let them know you\u2019re annoyed", "D"], ["Say \u201cno worries\u201d and quietly pull back from them", "W"], ["Wonder what you did wrong", "A"], ["Say you were looking forward to it and rebook", "L"]] },
        { type: "scale", part: "You and you", key: "critic", max: 5, ends: ["Not me", "Very me"], q: "I\u2019m harder on myself than I\u2019d ever be on a friend." },
        { type: "scale", part: "You and others", key: "blame", max: 5, ends: ["Not me", "Very me"], q: "In an argument, I focus on who\u2019s right." },
        { type: "scenario", part: "How you react", q: "You give someone honest feedback and they push back hard. Your first move?",
          opts: [["Hold your ground and make the point again", "D"], ["Drop it and avoid the topic from now on", "W"], ["Feel like you said it wrong and over-apologize", "A"], ["Ask what they heard you say", "L"]] },
        { type: "scale", part: "Repair", key: "repair", max: 5, ends: ["Not me", "Very me"], q: "After a conflict, I can own my part without drowning in guilt." },
        { type: "scale", part: "Repair", key: "repair", max: 5, ends: ["Not me", "Very me"], q: "I know the difference between affecting someone and being responsible for their feelings." },
        { type: "grid", part: "Your needs", q: "Right now, how met is each of these needs in your life?", hint: "1 is rarely met. 5 is fully met.", max: 5,
          keys: ["connection", "safety", "rest", "autonomy", "meaning", "respect"], button: "See my results" }
      ],

      results: {
        actionsTitle: "Three things to do tomorrow",
        actionsLead: "Small on purpose. Pick one, or do all three.",
        care: "If anything heavy came up while answering, slow down. Bring it to a coach or a therapist. You don\u2019t have to work through it alone.",
        videoTitle: "A message from Brett for this pattern",
        pdfTitle: "Your workbook",
        pdfBody: "The Heart Over Head workbook is the full framework behind this check-in.",
        pdfButton: "Download the workbook"
      }
    }
  }
};
