import React, { useState, useEffect, Fragment, FC, useRef } from 'react'
import { render, Text, Newline, Static, Box, Spacer, measureElement } from 'ink'
import { testEngine } from './factory/testEngine.js'
import type { TestItem } from './factory/types.js'
import { useSnapshot } from 'valtio/react'

const App = () => {
  const [counter, setCounter] = useState(0)
  const server = useSnapshot(testEngine.context.server.state)
  const bot = useSnapshot(testEngine.context.bot.state)

  // TODO: Change over to Valtio
  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((previousCounter) => previousCounter + 1)
    }, 100)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <Box flexDirection="column" flexGrow={1}>
      <Text color={'white'}>Server {server.isReady.toString()}</Text>
      <Text color={'white'}>Bot {bot.isReady.toString()}</Text>
      <Static
        items={testEngine.state.suite.filter(
          (item) =>
            item.state !== 'pending' &&
            item.state !== 'running' &&
            item.name !== testEngine.state.current?.name
        )}>
        {(item) => (
          <Text color={'white'} key={item.name}>
            <Text backgroundColor={colorMap[item.state]}> {item.state} </Text>
            &nbsp;
            {item.name}
          </Text>
        )}
      </Static>
      <Text>
        <TestResult />
      </Text>
      <Spacer />
    </Box>
  )
}

const colorMap = {
  success: 'green',
  failed: 'red',
  pending: 'yellow',
  running: 'yellow',
}

const charMap = {
  success: '✓',
  failed: '✗',
  pending: '⏳',
  running: '➔',
}

const TestResult = () => {
  const { current } = testEngine.state

  if (!current) return null

  return (
    <Text color={'white'}>
      <Text backgroundColor={colorMap[current.state]}> {current.state} </Text>
      &nbsp;
      {current.name}
      <Newline />
      <Text wrap="truncate">
        {current.tests?.map((test) => (
          <TestItem key={current.name + test.name} test={test} />
        ))}
      </Text>
    </Text>
  )
}

const TestItem: FC<{ test: TestItem }> = ({ test }) => {
  return (
    <>
      &nbsp;
      <Text color={colorMap[test.state]}>
        {test.state === 'running' ? <Spinner /> : charMap[test.state]}
      </Text>
      &nbsp;
      <Text wrap={'truncate'}>{test.name}</Text>
      {test.result && (
        <>
          {test.msgs?.map((msg) => {
            return (
              <>
                <Newline />
                &nbsp;&nbsp;
                <Text color={'gray'}>Chat: </Text>
                <Text color={'white'}>{msg}</Text>
              </>
            )
          })}
          {test.result?.message}
          <Newline />
        </>
      )}
      <Newline />
    </>
  )
}

const spinnerMap = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

const Spinner = () => {
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((previousCounter) => {
        const result = previousCounter + 1

        if (result > spinnerMap.length - 1) {
          return 0
        }

        return result
      })
    }, 100)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return <Text>{spinnerMap[counter]}</Text>
}

export const startRender = () => render(<App />, {})
