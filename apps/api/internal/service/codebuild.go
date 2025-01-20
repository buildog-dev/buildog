package service

import (
	"context"
	"fmt"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/codebuild"
	"github.com/aws/aws-sdk-go-v2/service/codebuild/types"
)

type CodebuildService struct {
	client *codebuild.Client
}

func NewCodebuildService(client *codebuild.Client) *CodebuildService {
	return &CodebuildService{client: client}
}

func (s *CodebuildService) CreateCodebuild(organization_id string) error {
	// Load the AWS configuration
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		return fmt.Errorf("failed to load configuration, %v", err)
	}

	// Create a CodeBuild client
	client := codebuild.NewFromConfig(cfg)

	// Create the project input
	createInput := &codebuild.CreateProjectInput{
		Name: aws.String(organization_id),
		Environment: &types.ProjectEnvironment{
			Type:           types.EnvironmentTypeLinuxContainer,
			ComputeType:    types.ComputeTypeBuildGeneral1Small,
			Image:          aws.String("aws/codebuild/standard:6.0"),
			PrivilegedMode: aws.Bool(false),
			EnvironmentVariables: []types.EnvironmentVariable{
				{
					Name:  aws.String("ORGANIZATION_ID"),
					Value: aws.String(organization_id),
				},
			},
		},
		ServiceRole: aws.String("arn:aws:iam::460274532142:role/CodeBuildServiceRole"),
		Source: &types.ProjectSource{
			Type:     types.SourceTypeGithub,
			Location: aws.String("https://github.com/kuzeykose/buildog-playground.git"),
		},
		Artifacts: &types.ProjectArtifacts{
			Type: types.ArtifactsTypeNoArtifacts,
			// Location: aws.String("your-output-bucket-name"), // Replace with your S3 bucket for artifacts
		},
	}

	// Create the project
	output, err := client.CreateProject(context.TODO(), createInput)
	if err != nil {
		// Log the error details for better debugging
		fmt.Printf("Error details: %+v\n", err)
		return fmt.Errorf("failed to create project, %v", err)
	}

	// Output the project details
	fmt.Printf("Created project: %s\n", *output.Project.Name)

	return nil
}

func (s *CodebuildService) StartCodebuild(projectName string) error {
	// Load the AWS configuration
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		return fmt.Errorf("failed to load configuration, %v", err)
	}

	// Create a CodeBuild client
	client := codebuild.NewFromConfig(cfg)

	// Start the build input
	startBuildInput := &codebuild.StartBuildInput{
		ProjectName: aws.String(projectName),
	}

	// Start the build
	output, err := client.StartBuild(context.TODO(), startBuildInput)
	if err != nil {
		// Log the error details for better debugging
		fmt.Printf("Error details: %+v\n", err)
		return fmt.Errorf("failed to start build, %v", err)
	}

	// Output the build details
	fmt.Printf("Started build: %s\n", *output.Build.Id)

	return nil
}
