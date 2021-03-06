import { Construct, SecretValue, Stack, StackProps } from '@aws-cdk/core';
import { CodePipeline, CodePipelineSource, ShellStep } from "@aws-cdk/pipelines";
import { CdkpipelinesDemoStage } from './cdkpipelines-demo-stage';
/**
 * The stack that defines the application pipeline
 */
export class CdkpipelinesDemoPipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const pipeline = new CodePipeline(this, 'Pipeline', {
            // The pipeline name
            pipelineName: 'MyServicePipeline',



            // How it will be built and synthesized
            synth: new ShellStep('Synth', {
                // Where the source can be found
                input: CodePipelineSource.gitHub('Vladhus/awsTempo', 'main'),

                // Install dependencies, build and run cdk synth
                commands: [
                    'cd cdkpipelines-demo',
                    'npm ci',
                    'npm run build',
                    'npx cdk synth'
                ],
                primaryOutputDirectory: 'cdkpipelines-demo/cdk.out',
            }),
        });

        pipeline.addStage(new CdkpipelinesDemoStage(this, 'PreProd', {
            env: { account: '061500401071', region: 'eu-central-1' }
        }));
    }
}
