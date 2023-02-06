import { Group, Container, createStyles, Switch, useMantineColorScheme, useMantineTheme, Button } from '@mantine/core';
import Head from 'next/head';
import { IconSun, IconMoon } from '@tabler/icons';
import { useCallback } from 'react';
import { showNotification } from '@mantine/notifications';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@store/index';
import { increase, decrease, setCountValue } from '@store/reducers/counterExample';

// examples
import OtelTracer from '@components/OtelTracer';
import SvgIcon from '@components/SvgIcon';

const useStyles = createStyles(() => ({
  root: {
    paddingTop: 80,
    paddingBottom: 80,
  },
}));

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  return (
    <Group position="center" my={30}>
      <Switch
        checked={colorScheme === 'dark'}
        onChange={() => toggleColorScheme()}
        size="lg"
        onLabel={<IconSun color={theme.white} size={20} stroke={1.5} />}
        offLabel={<IconMoon color={theme.colors.gray[6]} size={20} stroke={1.5} />}
      />
    </Group>
  );
}

function NotificationsButton() {
  const showNotificationExample = useCallback(() => {
    showNotification({
      title: 'Notify',
      message: 'Hello, have a nice day~',
      color: 'violet',
    });
  }, []);

  return (
    <Group position="center">
      <Button onClick={showNotificationExample}>Show notification</Button>
    </Group>
  );
}

function ReduxExample() {
  const counterState = useSelector((state: RootState) => state.counterState);
  const dispatch = useDispatch();

  return (
    <Group position="center" my={30}>
      <div>value: {counterState.count}</div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <Button onClick={() => dispatch(increase())}>increase</Button>
        <Button onClick={() => dispatch(decrease())}>decrease</Button>
        <Button onClick={() => dispatch(setCountValue(0))}>reset</Button>
      </div>
    </Group>
  );
}

export default function Index() {
  const { classes } = useStyles();

  return (
    <>
      <Head>
        <title>Project G</title>
        <meta property="og:title" content="Project G" key="title" />
      </Head>
      <Container className={classes.root} size={420} my={40}>
        <ThemeToggle />
        <NotificationsButton />
        <ReduxExample />
        <OtelTracer />
        <SvgIcon width="30px" height="30px" path="favicon" />
        <SvgIcon width="20px" height="20px" path="svgs/favicon-copy" />
      </Container>{' '}
    </>
  );
}
