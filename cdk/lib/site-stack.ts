import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import path from "path";

export class SiteStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const domainName = "iokira.net";

        const siteCertificate =
            cdk.aws_certificatemanager.Certificate.fromCertificateArn(
                this,
                "SiteCertificate",
                process.env.SITE_CERTIFICATE_ARN || "",
            );

        const siteBucket = new cdk.aws_s3.Bucket(this, "SiteBucket", {
            bucketName: "iokira-net",
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            blockPublicAccess: cdk.aws_s3.BlockPublicAccess.BLOCK_ALL,
            enforceSSL: true,
        });

        const redirectFunction = new cdk.aws_cloudfront.Function(
            this,
            "RedirectIndexHtmlFunction",
            {
                functionName: "redirect-index-html",
                code: cdk.aws_cloudfront.FunctionCode.fromFile({
                    filePath: path.join(
                        __dirname,
                        "functions/cloudfront-function.js",
                    ),
                }),
                runtime: cdk.aws_cloudfront.FunctionRuntime.JS_2_0,
            },
        );

        const distribution = new cdk.aws_cloudfront.Distribution(
            this,
            "SiteDistribution",
            {
                defaultRootObject: "index.html",
                priceClass: cdk.aws_cloudfront.PriceClass.PRICE_CLASS_200,
                defaultBehavior: {
                    origin: cdk.aws_cloudfront_origins.S3BucketOrigin.withOriginAccessControl(
                        siteBucket,
                    ),
                    viewerProtocolPolicy:
                        cdk.aws_cloudfront.ViewerProtocolPolicy
                            .REDIRECT_TO_HTTPS,
                    cachePolicy:
                        cdk.aws_cloudfront.CachePolicy.CACHING_OPTIMIZED,
                    functionAssociations: [
                        {
                            function: redirectFunction,
                            eventType:
                                cdk.aws_cloudfront.FunctionEventType
                                    .VIEWER_REQUEST,
                        },
                    ],
                },
                errorResponses: [
                    {
                        httpStatus: 403,
                        responseHttpStatus: 200,
                        responsePagePath: "/404.html",
                        ttl: cdk.Duration.minutes(5),
                    },
                    {
                        httpStatus: 404,
                        responseHttpStatus: 200,
                        responsePagePath: "/404.html",
                        ttl: cdk.Duration.minutes(5),
                    },
                ],
                domainNames: [domainName],
                certificate: siteCertificate,
            },
        );

        new cdk.aws_s3_deployment.BucketDeployment(this, "DeploySite", {
            sources: [
                cdk.aws_s3_deployment.Source.asset(
                    path.join(__dirname, "../../dist"),
                ),
            ],
            destinationBucket: siteBucket,
            distribution: distribution,
            distributionPaths: ["/*"],
        });

        const zone = cdk.aws_route53.HostedZone.fromLookup(this, "HostedZone", {
            domainName: "iokira.net",
        });

        new cdk.aws_route53.ARecord(this, "SiteAliasRecord", {
            zone: zone,
            target: cdk.aws_route53.RecordTarget.fromAlias(
                new cdk.aws_route53_targets.CloudFrontTarget(distribution),
            ),
            recordName: domainName,
        });
    }
}
