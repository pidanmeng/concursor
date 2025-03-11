//  初始化 concursor

import { getPayload } from "@concursor/api";
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from "../utils";
import { currentUser } from "../auth/currentUser";

type setting = { projectId?: string, disableConcursor?: boolean }
export async function initConcursor() {
    //  从本地.vscode/settings.json 文件中读取 concursor 配置信息
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        logger.info("no work space folder")
        return;
    }

    const settingsPath = path.join(workspaceFolder.uri.fsPath, '.vscode', 'settings.json');
    let settings: any = {};

    try {
        if (fs.existsSync(settingsPath)) {
            const settingsContent = fs.readFileSync(settingsPath, 'utf8');
            if (settingsContent) {
                settings = JSON.parse(settingsContent);
            }
        }
    } catch (error) {
        console.error('读取设置文件失败:', error);
    }

    const { projectId, disableConcursor }: setting = settings.concursor || {};

    //  如果设置了忽略 disableConcursor为 truei或者已经有 ProjectId，则直接返回
    if (disableConcursor || projectId) {
        return;
    }

    //  弹Notifications询问用户是否需要初始化
    const init = await vscode.window.showInformationMessage(
        '是否要初始化 Concursor？',
        '是',
        '否'
    );

    //  不 init，设置为忽略
    if (init !== '是') {
        //  写设置 disableConcursor = true
        updateSettings(settingsPath, settings, { disableConcursor: true });
        return;
    }

    //  调用接口获取用户创建的 Project Id 列表
    const payload = getPayload();
    const project = await payload.find({
        collection: 'projects',
        where: {
            'creator.value': {
                equals: currentUser.value?.id
            }
        }
    });

    let newProjectId: string | undefined;

    let projectItems: any[] = []
    if (project.docs && project.docs.length > 0) {
        //  在 quick pick中展示用户的 Project列表和新建 Project
        projectItems = project.docs.map(doc => ({
            label: doc.title,
            description: doc.description || '',
            detai: doc.tags,
            id: doc.id
        }));
    }

    const createNewItem = { label: '+ 新建项目', description: '创建新的项目', id: '', detail: '', alwaysShow: true };
    const items = [...projectItems, createNewItem];

    const selected = await vscode.window.showQuickPick(items, {
        placeHolder: '选择一个项目或创建新项目'
    });

    if (!selected) {
        return; // 用户取消了选择
    }

    if (selected === createNewItem) {
        newProjectId = await createNewProject(payload);
    } else {
        newProjectId = selected.id;
    }
    logger.info('newProjectId', newProjectId)
    if (newProjectId) {
        // 写 ProjectId 到设置
        updateSettings(settingsPath, settings, { projectId: newProjectId });
        vscode.window.showInformationMessage(`Concursor 已初始化，项目ID: ${newProjectId}`);
    }
}

// 创建新项目
async function createNewProject(payload: any): Promise<string | undefined> {
    const projectName = await vscode.window.showInputBox({
        placeHolder: '请输入项目名称',
        prompt: '创建新项目'
    });
    if (!projectName) {
        return undefined;
    }

    try {
        const newProject = await payload.create({
            collection: 'projects',
            data: {
                title: projectName,
                // 可以添加其他项目属性
            }
        });
        return newProject.doc?.id;
    } catch (error) {
        vscode.window.showErrorMessage(`创建项目失败: ${error}`);
        return undefined;
    }
}

// 更新设置文件
function updateSettings(settingsPath: string, settings: any, concursorSettings: setting): void {
    try {
        // 确保 .vscode 目录存在
        const vscodeDir = path.dirname(settingsPath);
        if (!fs.existsSync(vscodeDir)) {
            fs.mkdirSync(vscodeDir, { recursive: true });
        }

        // 更新设置
        settings.concursor = { ...(settings.concursor || {}), ...concursorSettings };

        // 写入文件
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 4), 'utf8');
    } catch (error) {
        console.error('更新设置文件失败:', error);
        vscode.window.showErrorMessage('无法更新 Concursor 设置');
    }
}