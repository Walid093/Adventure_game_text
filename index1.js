//2nd option 

import chalk from 'chalk';
import inquirer from 'inquirer';
import chalkAnimation from 'chalk-animation';
import { createSpinner } from 'nanospinner';
let playerName = '';
let playerHealth = 100;
let playerAttackDamage = 50;
let playerHealthPotions = 3;
const enemyStats = {
    skeleton: { health: 75, attackDamage: 25 },
    zombie: { health: 75, attackDamage: 25 },
    warrior: { health: 75, attackDamage: 25 },
    assassin: { health: 75, attackDamage: 25 },
};
async function welcome() {
    const rainbowTitle = chalkAnimation.rainbow('Welcome to the Dungeon ..  \n');
    await sleep();
    rainbowTitle.stop();
    console.log(`${chalk.bgBlue(' State your name ')}   `);
}
async function handleFight(enemy) {
    const enemyStatsEntry = enemyStats[enemy];
    if (enemyStatsEntry) {
        let enemyHealth = enemyStatsEntry.health;
        const enemyAttackDamage = enemyStatsEntry.attackDamage;
        if (playerHealth < enemyHealth) {
            await useHealthPotion();
        }
        const spinner = createSpinner(`Fighting ${enemy}...`).start();
        await sleep(2000); // Simulate fight
        spinner.stop();
        while (playerHealth > 0 && enemyHealth > 0) {
            // Player attacks enemy
            enemyHealth -= playerAttackDamage;
            // Enemy attacks player
            playerHealth -= enemyAttackDamage;
            if (playerHealth < 0) {
                playerHealth = 0;
            }
        }
        if (playerHealth > 0) {
            console.log(chalk.greenBright.bold(`${playerName} defeated ${enemy}!`));
            // 50% chance of dropping a health potion
            if (Math.random() < 0.5) {
                playerHealthPotions++;
                console.log(chalk.green('A health potion was dropped!'));
            }
        }
        else {
            console.log(chalk.bgRed.white.bold(`${playerName} was defeated by ${enemy}! Game Over.`));
        }
    }
}
async function askName() {
    const answers = await inquirer.prompt({
        name: 'player_name',
        type: 'input',
        message: 'What is your name?',
        default: 'Player',
    });
    playerName = answers.player_name;
}
async function selectEnemy() {
    const { enemy } = await inquirer.prompt({
        name: 'enemy',
        type: 'list',
        message: 'Choose your enemy to fight:',
        choices: ['skeleton', 'zombie', 'warrior', 'assassin'],
    });
    return enemy;
}
async function useHealthPotion() {
    if (playerHealthPotions > 0 && playerHealth < 100) {
        playerHealth += 30;
        if (playerHealth > 100) {
            playerHealth = 100;
        }
        playerHealthPotions--;
        console.log(chalk.bgMagenta.white.bold(`${playerName} used a health potion. Current health: ${playerHealth}`));
    }
    else {
        console.log(chalk.yellow('No health potions available or health already at max.'));
    }
}
const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));
async function main() {
    console.clear();
    await welcome();
    await askName();
    while (true) {
        const enemy = await selectEnemy();
        await handleFight(enemy);
        // Ask player if they want to use a health potion
        const { usePotion } = await inquirer.prompt({
            name: 'usePotion',
            type: 'confirm',
            message: 'Do you want to use a health potion?',
        });
        if (usePotion) {
            await useHealthPotion();
        }
        // Ask player if they want to continue playing
        const { continuePlaying } = await inquirer.prompt({
            name: 'continuePlaying',
            type: 'confirm',
            message: 'Do you want to continue playing?',
        });
        if (!continuePlaying) {
            console.log(chalk.yellow('Thanks for playing!'));
            break;
        }
    }
}
// Run it with top-level await
main();
