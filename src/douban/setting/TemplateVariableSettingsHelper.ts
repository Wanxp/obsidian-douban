import SettingsManager from "@App/setting/SettingsManager";
import {i18nHelper} from "../../lang/helper";
import {Setting} from "obsidian";

export function constructTemplateVariablesUI(containerEl: HTMLElement, manager: SettingsManager) {
	containerEl.createEl('h3', { text: i18nHelper.getMessage('1230') });
	containerEl.createEl('p', { text: i18nHelper.getMessage('122003') });

	const basicVariablesTable = new DocumentFragment();
	basicVariablesTable.createDiv().innerHTML = `
${i18nHelper.getMessage('122004')}
<br>
<br>
<table border="1">
	<tr>
		<th>${i18nHelper.getMessage('300101')}</th>
		<th>${i18nHelper.getMessage('300102')}</th>
		<th>${i18nHelper.getMessage('300103')}</th>
		<th>${i18nHelper.getMessage('300104')}</th>
		<th>${i18nHelper.getMessage('300105')}</th>
		<th>${i18nHelper.getMessage('300106')}</th>
		<th>${i18nHelper.getMessage('300107')}</th>
		<th>${i18nHelper.getMessage('300108')}</th>
	</tr>
	<tr>
		<td>id</td>
		<td>${i18nHelper.getMessage('310101')}</td>
		<td>${i18nHelper.getMessage('310201')}</td>
		<td>${i18nHelper.getMessage('310301')}</td>
		<td>${i18nHelper.getMessage('310401')}</td>
		<td>${i18nHelper.getMessage('310501')}</td>
		<td>${i18nHelper.getMessage('310601')}</td>
		<td>${i18nHelper.getMessage('310701')}</td>
	</tr>
	<tr>
		<td>title</td>
		<td>${i18nHelper.getMessage('310102')}</td>
		<td>${i18nHelper.getMessage('310202')}</td>
		<td>${i18nHelper.getMessage('310302')}</td>
		<td>${i18nHelper.getMessage('310402')}</td>
		<td>${i18nHelper.getMessage('310502')}</td>
		<td>${i18nHelper.getMessage('310602')}</td>
		<td>${i18nHelper.getMessage('310702')}</td>
	</tr>
	<tr>
		<td>type</td>
		<td>${i18nHelper.getMessage('310103')}</td>
		<td>${i18nHelper.getMessage('310203')}</td>
		<td>${i18nHelper.getMessage('310303')}</td>
		<td>${i18nHelper.getMessage('310403')}</td>
		<td>${i18nHelper.getMessage('310503')}</td>
		<td>${i18nHelper.getMessage('310603')}</td>
		<td>${i18nHelper.getMessage('310703')}</td>
	</tr>
	<tr>
		<td>score</td>
		<td>${i18nHelper.getMessage('310104')}</td>
		<td>${i18nHelper.getMessage('310204')}</td>
		<td>${i18nHelper.getMessage('310304')}</td>
		<td>${i18nHelper.getMessage('310404')}</td>
		<td>${i18nHelper.getMessage('310504')}</td>
		<td>${i18nHelper.getMessage('310604')}</td>
		<td>${i18nHelper.getMessage('310704')}</td>
	</tr>
	<tr>
		<td>image</td>
		<td>${i18nHelper.getMessage('310105')}</td>
		<td>${i18nHelper.getMessage('310205')}</td>
		<td>${i18nHelper.getMessage('310305')}</td>
		<td>${i18nHelper.getMessage('310405')}</td>
		<td>${i18nHelper.getMessage('310505')}</td>
		<td>${i18nHelper.getMessage('310605')}</td>
		<td>${i18nHelper.getMessage('310705')}</td>
	</tr>
	<tr>
		<td>url</td>
		<td>${i18nHelper.getMessage('310106')}</td>
		<td>${i18nHelper.getMessage('310206')}</td>
		<td>${i18nHelper.getMessage('310306')}</td>
		<td>${i18nHelper.getMessage('310406')}</td>
		<td>${i18nHelper.getMessage('310506')}</td>
		<td>${i18nHelper.getMessage('310606')}</td>
		<td>${i18nHelper.getMessage('310706')}</td>
	</tr>
	<tr>
		<td>desc</td>
		<td>${i18nHelper.getMessage('310107')}</td>
		<td>${i18nHelper.getMessage('310207')}</td>
		<td>${i18nHelper.getMessage('310307')}</td>
		<td>${i18nHelper.getMessage('310407')}</td>
		<td>${i18nHelper.getMessage('310507')}</td>
		<td>${i18nHelper.getMessage('310607')}</td>
		<td>${i18nHelper.getMessage('310707')}</td>
		
	</tr>
	<tr>
		<td>publisher</td>
		<td>${i18nHelper.getMessage('310108')}</td>
		<td>${i18nHelper.getMessage('310208')}</td>
		<td>${i18nHelper.getMessage('310308')}</td>
		<td>${i18nHelper.getMessage('310408')}</td>
		<td>${i18nHelper.getMessage('310508')}</td>
		<td>${i18nHelper.getMessage('310608')}</td>
		<td>${i18nHelper.getMessage('310708')}</td>
	</tr>
	<tr>
		<td>datePublished</td>
		<td>${i18nHelper.getMessage('310109')}</td>
		<td>${i18nHelper.getMessage('310209')}</td>
		<td>${i18nHelper.getMessage('310309')}</td>
		<td>${i18nHelper.getMessage('310409')}</td>
		<td>${i18nHelper.getMessage('310509')}</td>
		<td>${i18nHelper.getMessage('310609')}</td>
		<td>${i18nHelper.getMessage('310709')}</td>
	</tr>
	<tr>
		<td>genre</td>
		<td>${i18nHelper.getMessage('310110')}</td>
		<td>${i18nHelper.getMessage('310210')}</td>
		<td>${i18nHelper.getMessage('310310')}</td>
		<td>${i18nHelper.getMessage('310410')}</td>
		<td>${i18nHelper.getMessage('310510')}</td>
		<td>${i18nHelper.getMessage('310610')}</td>
		<td>${i18nHelper.getMessage('310710')}</td>
	</tr>
	<tr>
		<td>currentDate</td>
		<td>${i18nHelper.getMessage('330101')}</td>
		<td>${i18nHelper.getMessage('330101')}</td>
		<td>${i18nHelper.getMessage('330101')}</td>
		<td>${i18nHelper.getMessage('330101')}</td>
		<td>${i18nHelper.getMessage('330101')}</td>
		<td>${i18nHelper.getMessage('330101')}</td>
		<td>${i18nHelper.getMessage('330101')}</td>
	</tr>
	<tr>
		<td>currentTime</td>
		<td>${i18nHelper.getMessage('330102')}</td>
		<td>${i18nHelper.getMessage('330102')}</td>
		<td>${i18nHelper.getMessage('330102')}</td>
		<td>${i18nHelper.getMessage('330102')}</td>
		<td>${i18nHelper.getMessage('330102')}</td>
		<td>${i18nHelper.getMessage('330102')}</td>
		<td>${i18nHelper.getMessage('330102')}</td>
	</tr>
</table>`;

	new Setting(containerEl)
		.setName(i18nHelper.getMessage('122001'))
		.setDesc(basicVariablesTable)
	;


	const extraVariablesTable = new DocumentFragment();
	extraVariablesTable.createDiv().innerHTML = `
${i18nHelper.getMessage('122004')}
<br>
<br>
<table border="1">
	<tr>
		<th>${i18nHelper.getMessage('300101')}</th>
		<th>${i18nHelper.getMessage('300102')}</th>
		<th>${i18nHelper.getMessage('300103')}</th>
		<th>${i18nHelper.getMessage('300104')}</th>
		<th>${i18nHelper.getMessage('300105')}</th>
		<th>${i18nHelper.getMessage('300106')}</th>
		<th>${i18nHelper.getMessage('300107')}</th>
		<th>${i18nHelper.getMessage('300108')}</th>
	</tr>
	<tr>
		<td>${i18nHelper.getMessage('320101')}</th>
		<td>${i18nHelper.getMessage('310111')}</th>
		<td>${i18nHelper.getMessage('310211')}</th>
		<td>${i18nHelper.getMessage('310311')}</th>
		<td>${i18nHelper.getMessage('310411')}</th>
		<td>${i18nHelper.getMessage('310511')}</th>
		<td>${i18nHelper.getMessage('310611')}</th>
		<td>${i18nHelper.getMessage('310711')}</th>
	</tr>
		<td>${i18nHelper.getMessage('320102')}</th>
		<td>${i18nHelper.getMessage('310112')}</th>
		<td>${i18nHelper.getMessage('310212')}</th>
		<td>${i18nHelper.getMessage('310312')}</th>
		<td>${i18nHelper.getMessage('310412')}</th>
		<td>${i18nHelper.getMessage('310512')}</th>
		<td>${i18nHelper.getMessage('310612')}</th>
		<td>${i18nHelper.getMessage('310712')}</th>
	</tr>
	<tr>
		<td>${i18nHelper.getMessage('320103')}</th>
		<td>${i18nHelper.getMessage('310113')}</th>
		<td>${i18nHelper.getMessage('310213')}</th>
		<td>${i18nHelper.getMessage('310313')}</th>
		<td>${i18nHelper.getMessage('310413')}</th>
		<td>${i18nHelper.getMessage('310513')}</th>
		<td>${i18nHelper.getMessage('310613')}</th>
		<td>${i18nHelper.getMessage('310713')}</th>
	</tr>
	<tr>
		<td>${i18nHelper.getMessage('320104')}</th>
		<td>${i18nHelper.getMessage('310114')}</th>
		<td>${i18nHelper.getMessage('310214')}</th>
		<td>${i18nHelper.getMessage('310314')}</th>
		<td>${i18nHelper.getMessage('310414')}</th>
		<td>${i18nHelper.getMessage('310514')}</th>
		<td>${i18nHelper.getMessage('310614')}</th>
		<td>${i18nHelper.getMessage('310714')}</th>
	</tr>
	<tr>
		<td>${i18nHelper.getMessage('320105')}</th>
		<td>${i18nHelper.getMessage('310115')}</th>
		<td>${i18nHelper.getMessage('310215')}</th>
		<td>${i18nHelper.getMessage('310315')}</th>
		<td>${i18nHelper.getMessage('310415')}</th>
		<td>${i18nHelper.getMessage('310515')}</th>
		<td>${i18nHelper.getMessage('310615')}</th>
		<td>${i18nHelper.getMessage('310715')}</th>
	</tr>
	<tr>
		<td>${i18nHelper.getMessage('320106')}</th>
		<td>${i18nHelper.getMessage('310116')}</th>
		<td>${i18nHelper.getMessage('310216')}</th>
		<td>${i18nHelper.getMessage('310316')}</th>
		<td>${i18nHelper.getMessage('310416')}</th>
		<td>${i18nHelper.getMessage('310516')}</th>
		<td>${i18nHelper.getMessage('310616')}</th>
		<td>${i18nHelper.getMessage('310716')}</th>
	</tr>
	<tr>
		<td>${i18nHelper.getMessage('320107')}</th>
		<td>${i18nHelper.getMessage('310117')}</th>
		<td>${i18nHelper.getMessage('310217')}</th>
		<td>${i18nHelper.getMessage('310317')}</th>
		<td>${i18nHelper.getMessage('310417')}</th>
		<td>${i18nHelper.getMessage('310517')}</th>
		<td>${i18nHelper.getMessage('310617')}</th>
		<td>${i18nHelper.getMessage('310717')}</th>
	</tr>
	
	<tr>
		<td>${i18nHelper.getMessage('320108')}</th>
		<td>${i18nHelper.getMessage('310118')}</th>
		<td>${i18nHelper.getMessage('310218')}</th>
		<td>${i18nHelper.getMessage('310318')}</th>
		<td>${i18nHelper.getMessage('310418')}</th>
		<td>${i18nHelper.getMessage('310518')}</th>
		<td>${i18nHelper.getMessage('310618')}</th>
		<td>${i18nHelper.getMessage('310718')}</th>
	</tr>
</table>`;


	new Setting(containerEl)
		.setName(i18nHelper.getMessage('122002'))
		.setDesc(extraVariablesTable);


	const userInfoVariables = new DocumentFragment();
	userInfoVariables.createDiv().innerHTML = `
${i18nHelper.getMessage('160225')}
<br>
<strong>myTags</strong> → ${i18nHelper.getMessage('160226')}<br>
<strong>myRate</strong> → ${i18nHelper.getMessage('160227')}<br>
<strong>myState</strong> → ${i18nHelper.getMessage('160228')}<br>
<strong>myComment</strong> → ${i18nHelper.getMessage('160229')}<br>
<strong>myCollectionDate</strong> → ${i18nHelper.getMessage('160230')}<br>


`
	;
	new Setting(containerEl)
		.setName(i18nHelper.getMessage('122010'))
		.setDesc(userInfoVariables);
}
