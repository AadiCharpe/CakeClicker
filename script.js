import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";

kaboom();

scene("game", ()=>{
    let score = 0;
    let prices = [100, 500, 2000, 5000, 20000, 500];
    let owned = [0, 0, 0, 0, 0];
    let cps = 0;
    let priceText = [];
    let ownedText = [];
    let backgroundCakes = [];
    let clickStrength = 1;
    loadSprite("cake", "simple-birthday-cake-illustration-isolated-on-white-background-birthday-cake-cartoon-vector-removebg-preview.png");
    loadSound("buy", "click-21156.mp3");
    const upgradeNames = ["Cursor\n+1 Cake per Second", "Bakery\n+10 Cakes per Second", "Cake Farm\n+50 Cakes per Second", "Cake Factory\n+200 Cakes per Second", "Cake Power Plant\n+1000 Cakes per Second"];
    
    loadProgress();   
    
    add([
        rect(width(), height()),
        color(79, 149, 152)
    ])
    const cake = add([
        sprite("cake", {width: width() / 3, height: height() / 1.5}),
        anchor("center"),
        pos(width() / 4 + (width() / 8), height() / 2),
        area(),
        "cake"
    ])
    add([
        rect(width() / 2, height()),
        anchor("center"),
        pos(width(), height() / 2),
        color(40, 40, 40)
    ])
    add([
        rect(width() * 0.75, height() / 4),
        pos(0, height() - (height() / 8)),
        color(40, 40, 40)
    ])
    add([
        text("Stronger Mouse, x2 Cakes from Clicking"),
        anchor("center"),
        pos(width() * 0.375, height() - (height() / 13)),
        scale(0.75),
        area(),
        "mouseUpgrade"
    ])
    const price = add([
        text("Costs " + prices[5] + " to buy."),
        anchor("center"),
        pos(width() * 0.375, height() - 15),
        scale(0.65),
        color(36, 236, 52)
    ])
    const scoreText = add([
        text("Cakes: " + score),
        pos(24, 36),
        scale(2)
    ])
    const cpsText = add([
        text("Cakes Per Second: " + cps),
        pos(24, 128)
    ])
    for(let i = 0; i < upgradeNames.length; i++) {
        add([
            text(upgradeNames[i]),
            pos(width() - (width() / 4.25), i * 120 + 10),
            scale(0.5),
            area(),
            "upgrade"
        ])
        priceText.push(add([
                text("Costs " + prices[i] + " to buy."),
                pos(width() - (width() / 4.25), i * 120 + 50),
                scale(0.5),
                color(36, 236, 52)
            ])
        );
        ownedText.push(add([
                text(owned[i] + " owned."),
                pos(width() - (width() / 4.25), i * 120 + 70),
                scale(0.5)
            ])
        );
    }
    onClick("cake", ()=>{
        score += clickStrength;
        scoreText.text = "Cakes: " + score;
        backgroundCakes.push(
            add([
                sprite("cake"),
                anchor("center"),
                pos(Math.random() * width() * 0.75, 0),
                rotate(Math.random() * 360),
                scale(0.1)
            ])
        );
        cake.width -= 50;
        cake.height -= 50;
    })
    onClick("upgrade", (upgrade)=>{
        let name = upgrade.text;
        let option = -1;
        if(name.includes("Cursor") && score >= prices[0]) {
            cps++;
            option = 0;
        }
        else if(name.includes("Bakery") && score >= prices[1]) {
            cps += 10;
            option = 1;
        }
        else if(name.includes("Cake Farm") && score >= prices[2]) {
            cps += 50;
            option = 2;
        }
        else if(name.includes("Cake Factory") && score >= prices[3]) {
            cps += 200;
            option = 3
        }
        else if(name.includes("Cake Power Plant") && score >= prices[4]) {
            cps += 1000;
            option = 4;
        }
        if(option != -1) {
            score -= prices[option];
            prices[option] = Math.floor(prices[option] * 1.2);
            owned[option]++;
            priceText[option].text = "Costs " + prices[option] + " to buy.";
            ownedText[option].text = owned[option] + " owned.";
            cpsText.text = "Cakes Per Second: " + cps;
            play("buy");
        }
        scoreText.text = "Cakes: " + score;
    })
    onClick("mouseUpgrade", ()=>{
        if(score >= prices[5]) {
            clickStrength *= 2;
            score -= prices[5];
            prices[5] *= 3;
            scoreText.text = "Cakes: " + score;
            price.text = "Costs " + prices[5] + " to buy.";
            play("buy");
        }
    })
    loop(1, ()=>{
        score += cps;
        scoreText.text = "Cakes: " + score;
        if(cps > 0) {
            let m = 10;
            if(cps < 10)
                m = cps;
            for(let i = 0; i < m; i++) {
                backgroundCakes.push(
                    add([
                        sprite("cake"),
                        anchor("center"),
                        pos(Math.random() * width() * 0.75, 0),
                        rotate(Math.random() * 360),
                        scale(0.1)
                    ])
                );
            }
        }
    })
    loop(0.1, ()=>{
        if(cake.width < width() / 3) {
            cake.width = width() / 3;
            cake.height = height() / 1.5;
        }
    })
    onUpdate(()=>{
        for(const obj of backgroundCakes) {
            obj.move(0, 750);
            if(obj.pos.y > height() + 200) {
                backgroundCakes.shift();
                obj.destroy();
            }
        }
    })
    function saveProgress() {
        const gameData = {
            score: score,
            prices: prices,
            owned: owned,
            cps: cps,
            clickStrength: clickStrength
        };
        localStorage.setItem('cakeClickerProgress', JSON.stringify(gameData))
    }
    function loadProgress() {
        const savedData = localStorage.getItem('cakeClickerProgress');
        if(savedData) {
            const gameData = JSON.parse(savedData);
            score = gameData.score;
            prices = gameData.prices;
            owned = gameData.owned;
            cps = gameData.cps;
            clickStrength = gameData.clickStrength;
        }
    }
    function autoSave() {
        saveProgress();
        setTimeout(autoSave, 5000);
    }
    autoSave();
})

go("game");