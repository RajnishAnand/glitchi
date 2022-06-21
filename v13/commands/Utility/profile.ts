import { Command } from 'Interfaces';
import { Canvas, loadImage } from 'skia-canvas';

export const command: Command = {
	name: 'profile',
	description: 'profile Image Card',
	roleAccess: 'betaTesters',

	async run({ msg }) {
		const canvas = new Canvas(800, 400);
		const img = await loadImage(
			`${msg.author.displayAvatarURL({
				format: 'png',
				dynamic: true
			})}?size=4096`
		);

		const ctx = canvas.getContext('2d');

		// gradient
		const linearGradient = ctx.createLinearGradient(0, 0, 800, 400);
		linearGradient.addColorStop(0, '#86b0cc');
		linearGradient.addColorStop(1, '#4c7c9b');
		ctx.fillStyle = linearGradient;
		ctx.fillRect(5, 5, 790, 390);

		ctx.lineJoin = 'miter';
		ctx.lineWidth = 60;

		//White line
		ctx.beginPath();
		ctx.strokeStyle = '#c1e7ff77';
		ctx.moveTo(420, 20); //+5
		ctx.lineTo(296, 365); //+5
		ctx.lineTo(5, 365);
		ctx.stroke();

		//black line
		ctx.beginPath();
		ctx.strokeStyle = '#004c6d';
		ctx.moveTo(209, 410); //-
		ctx.lineTo(344, 35);
		ctx.lineTo(795, 35);
		ctx.stroke();

		//avatar frame
		ctx.strokeStyle = '#ffffff77';
		ctx.fillStyle = '#c1e7ff';
		ctx.fillRect(90, 90, 220, 220);
		ctx.strokeRect(90, 90, 220, 220);

		// Name
		ctx.font = '500 40px ubuntu';
		ctx.textBaseline = 'top';
		ctx.textAlign = 'right';
		ctx.fillStyle = '#ffffff';
		ctx.fillText(msg.author.username, 770, 70, 320);

		// discriminator
		ctx.font = '200 30px sans-serif';
		ctx.fillText(`#${msg.author.discriminator}`, 770, 20);
		ctx.drawImage(img, 90, 90, 220, 220);

		const card = canvas.toBufferSync('png');
		msg.reply({
			allowedMentions: { repliedUser: false },
			failIfNotExists: false,
			files: [card]
		});
	}
};
