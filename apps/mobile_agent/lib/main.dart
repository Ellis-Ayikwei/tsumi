import 'package:tsumi_kit/tsumi_kit.dart';

import 'router.dart';

void main() => runTsumiApp(
      title: 'Tsumi Runner',
      storagePrefix: 'tsumi_agent',
      requiredType: 'agent',
      wrongTypeMessage: 'This is the Tsumi Runner app. Customers use the Tsumi app to post errands.',
      router: buildRouter,
    );
