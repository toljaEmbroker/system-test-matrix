import React from 'react'
import {
  PageLayout,
  Table,
  usePageLayout,
  StackLayout,
  Text,
  NativeLink,
  TreeMap,
  Button,
} from '@filecoin/ui'
import { useHistory } from 'react-router-dom'

import { RepositoryData } from '@/mocks'

const Dashboard = () => {
  const pageLayout = usePageLayout({
    header: (
      <PageLayout.Header>
        <StackLayout>
          <Text type="heading 5">Systems</Text>
        </StackLayout>
      </PageLayout.Header>
    ),
  })
  const history = useHistory()

  return (
    <PageLayout {...pageLayout}>
      <PageLayout.Section>
        <Table
          columns={{
            repository: {
              header: 'Repository',
              Cell: ({ data }) => {
                return (
                  <StackLayout>
                    <Text>{data.projectName}</Text>
                    <NativeLink href={data.projectURL} target={'_blank'}>
                      {data.projectURL}
                    </NativeLink>
                  </StackLayout>
                )
              },
            },
            testKinds: {
              header: 'Test Kinds',
              width: 222,
              Cell: ({ data }) => {
                return (
                  <TreeMap
                    onClick={() => history.push('/repository-details')}
                    data={data.testKindsData.map(
                      ({ value, description, color }) => {
                        return { name: description, size: value, color }
                      },
                    )}
                  />
                )
              },
            },
            testStatus: {
              header: 'Test Status',
              width: 222,
              Cell: ({ data }) => {
                return (
                  <TreeMap
                    onClick={() => history.push('/repository-details')}
                    data={data.testStatusData.map(
                      ({ value, description, color }) => {
                        return { name: description, size: value, color }
                      },
                    )}
                  />
                )
              },
            },
            score: {
              header: 'Score',
              width: 155,
              Cell: ({ data, index }) => {
                //TODO@voja update this when we have some logic
                if (index === 0) {
                  return (
                    <Button
                      onClick={() => history.push('/repository-details')}
                      appearance="success"
                      size="small"
                    >
                      Good
                    </Button>
                  )
                }
                if (index === 1) {
                  return (
                    <Button
                      onClick={() => history.push('/repository-details')}
                      appearance="destructive"
                      size="small"
                    >
                      Bad
                    </Button>
                  )
                }
                return (
                  <Button
                    onClick={() => history.push('/repository-details')}
                    appearance="brand"
                    size="small"
                  >
                    Mediocre
                  </Button>
                )
              },
            },
          }}
          data={RepositoryData}
        />
      </PageLayout.Section>
    </PageLayout>
  )
}

export default Dashboard